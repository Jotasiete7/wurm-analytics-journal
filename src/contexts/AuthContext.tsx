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
    signInWithToken: (accessToken: string, refreshToken: string) => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(() => {
        // PERSISTENCE: Try to load role from local storage to avoid "reader" flash
        const cached = localStorage.getItem('auth_role');
        return (cached === 'admin' || cached === 'editor' || cached === 'reader') ? cached : null;
    });
    const [loading, setLoading] = useState(true);

    const fetchRole = async (userId: string) => {
        try {
            // Race supabase call against a 2s timeout. 
            // If Supabase is slow, we assume default role to unblock the UI.
            const failure = new Promise<{ error: string }>((resolve) =>
                setTimeout(() => resolve({ error: 'TIMEOUT' }), 2000)
            );

            const query = supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            const response = await Promise.race([query, failure]) as any;

            if (response.error || !response.data) {
                console.warn('Error fetching role (or timeout):', response.error);
                // RESILIENCE: If we already have a privileged role, keep it instead of downgrading due to network glitch
                if (role === 'admin' || role === 'editor') {
                    console.warn('Preserving existing role due to fetch failure:', role);
                    return role;
                }
                return 'reader';
            }
            return (response.data.role as UserRole) || 'reader';
        } catch (err) {
            console.error('Unexpected error fetching role:', err);
            // RESILIENCE: Keep existing role on crash
            if (role === 'admin' || role === 'editor') {
                return role;
            }
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            // console.log('Auth Event:', event); // Debug

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Optimization: Don't re-fetch role on TOKEN_REFRESH if we already have a role
                // This prevents session interruptions if the DB is momentarily slow during a refresh
                if (event === 'TOKEN_REFRESHED' && role) {
                    return;
                }

                const userRole = await fetchRole(session.user.id);
                setRole(userRole);
                localStorage.setItem('auth_role', userRole); // Sync to storage
            } else {
                setRole(null);
                localStorage.removeItem('auth_role');
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []); // Removed dependency array based on lint (or keep empty if intended to run once)

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            return { error: error?.message };
        } catch (e: any) {
            console.error('SignIn Exception:', e);
            return { error: e.message || 'Unknown error during sign in' };
        }
    };

    const signInWithToken = async (accessToken: string, refreshToken: string) => {
        try {
            const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            return { error: error?.message };
        } catch (e: any) {
            return { error: e.message };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, role, loading, signIn, signInWithToken, signOut }}>
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
