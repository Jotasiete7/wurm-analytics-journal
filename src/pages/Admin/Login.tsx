import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${msg}`]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLogs([]);
        addLog('Starting login process...');
        const sbUrl = import.meta.env.VITE_SUPABASE_URL;
        addLog(`Env Check: URL=${!!sbUrl}, Key=${!!(import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY.length > 20)}`);

        // DIAGNOSTIC 1: Direct Fetch
        try {
            addLog(`Ping: ${sbUrl}/auth/v1/health`);
            const start = Date.now();
            const res = await fetch(`${sbUrl}/auth/v1/health`, { method: 'GET' });
            const end = Date.now();
            addLog(`Ping Result: Status ${res.status} (${end - start}ms)`);
            if (!res.ok) addLog(`Ping Text: ${await res.text()}`);
        } catch (pingErr: any) {
            addLog(`Ping FAILED: ${pingErr.message}`);
        }

        // DIAGNOSTIC 2: Raw REST Login (Bypass SDK)
        try {
            addLog('Attempting RAW REST login...');
            const rawRes = await fetch(`${sbUrl}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
                },
                body: JSON.stringify({ email, password })
            });

            if (rawRes.ok) {
                addLog('RAW REST Login: SUCCESS (200 OK)');
                const data = await rawRes.json();
                addLog(`Got Token: ${data.access_token.substring(0, 10)}...`);
            } else {
                addLog(`RAW REST Login: FAILED (${rawRes.status})`);
                addLog(await rawRes.text());
            }
        } catch (rawErr: any) {
            addLog(`RAW REST Exception: ${rawErr.message}`);
        }

        try {
            addLog(`Attempting SDK sign in for ${email}...`);

            // Race against a timeout
            const timeoutPromise = new Promise<{ error: string }>((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out - Network or Supabase unreachable')), 10000)
            );

            const { error } = await Promise.race([
                signIn(email, password),
                timeoutPromise
            ]);

            if (error) {
                addLog(`Error returned: ${error}`);
                setError(error);
            } else {
                addLog('Sign in successful. Navigating...');
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            addLog(`CRITICAL ERROR: ${err.message}`);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-body)]">
            <div className="w-full max-w-sm p-8 border border-[var(--color-border)]">
                <h1 className="text-xl font-bold text-[var(--color-text-heading)] mb-6 text-center tracking-tight">
                    Editor's Desk
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-900 text-red-400 text-xs font-mono">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-[var(--color-text-meta)] uppercase mb-2">
                            Identity
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border)] p-3 text-[var(--color-text-body)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                            placeholder="editor@wurm.analytics"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-[var(--color-text-meta)] uppercase mb-2">
                            Passphrase
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border)] p-3 text-[var(--color-text-body)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[var(--color-text-heading)] text-[var(--color-bg-body)] font-bold py-3 hover:bg-white transition-colors text-sm uppercase tracking-widest"
                    >
                        Authenticate
                    </button>
                </form>
            </div>

            {/* Debug Console */}
            <div className="mt-8 w-full max-w-sm border border-[var(--color-border)] bg-black p-4 font-mono text-[10px] text-[var(--color-text-meta)] opacity-70">
                <div className="border-b border-[var(--color-border)] mb-2 pb-1 uppercase tracking-wider">Debug Log</div>
                <div className="h-24 overflow-y-auto space-y-1">
                    {logs.length === 0 ? <span className="italic opacity-50">Waiting for interaction...</span> : logs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Login;
