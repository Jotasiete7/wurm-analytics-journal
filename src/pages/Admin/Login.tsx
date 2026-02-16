import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const { signIn, signInWithToken } = useAuth();
    const navigate = useNavigate();

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${msg}`]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLogs([]); // Keep logs for now as they are useful for the user
        addLog('Starting robust login process...');

        try {
            // STRATEGY: Try SDK first. If it times out/fails, use Raw REST as fallback.
            // Actually, given the user history, let's try Raw REST *immediately* if we suspect SDK issues,
            // or just use Raw REST as the primary mechanism if SDK is known to timeout.

            // Let's try SDK with a short timeout, then fallback.
            addLog('Attempting SDK login...');

            const timeoutPromise = new Promise<{ error: string, timeout: boolean }>((resolve) =>
                setTimeout(() => resolve({ error: 'SDK_TIMEOUT', timeout: true }), 5000)
            );

            const sdkResult = await Promise.race([
                signIn(email, password),
                timeoutPromise
            ]);

            // @ts-ignore
            if (!sdkResult.timeout && !sdkResult.error) {
                addLog('SDK Login Successful.');
                navigate('/admin/dashboard');
                return;
            }

            if ((sdkResult as any).timeout) {
                addLog('SDK Timed out. Switching to Fallback (Raw REST)...');
            } else {
                addLog(`SDK Failed: ${(sdkResult as any).error}. Switching to Fallback...`);
            }

            // FALLBACK: Raw REST
            const sbUrl = import.meta.env.VITE_SUPABASE_URL;
            const sbKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            const res = await fetch(`${sbUrl}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': sbKey
                },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const data = await res.json();
                addLog('Fallback Raw Login Successful. Setting session...');
                const { error: sessionError } = await signInWithToken(data.access_token, data.refresh_token);

                if (sessionError) {
                    throw new Error(`Session set error: ${sessionError}`);
                }

                addLog('Session active. Redirecting...');
                navigate('/admin/dashboard');
            } else {
                const errText = await res.text();
                throw new Error(`Fallback failed: ${res.status} - ${errText}`);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            addLog(`ERROR: ${err.message}`);
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
