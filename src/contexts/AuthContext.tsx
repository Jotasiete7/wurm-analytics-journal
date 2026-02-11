import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

export type UserRole = 'reader' | 'editor' | 'admin';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: UserRole | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchRole = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error || !data) {
                console.warn('Error fetching role:', error);
                return 'reader';
            }
            return (data.role as UserRole) || 'reader';
        } catch (err) {
            console.error('Unexpected error fetching role:', err);
            return 'reader';
        }
    };

    useEffect(() => {
        // Init Session
        const initAuth = async () => {
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            setSession(existingSession);
            setUser(existingSession?.user ?? null);

            if (existingSession?.user) {
                const userRole = await fetchRole(existingSession.user.id);
                setRole(userRole);
            } else {
                setRole(null);
            }

            setLoading(false);
        };
        initAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Only fetch if we don't have it or if user changed (though usually session change implies user change)
                // For safety, re-fetch. It's cheap.
                const userRole = await fetchRole(session.user.id);
                setRole(userRole);
            } else {
                setRole(null);
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, role, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
