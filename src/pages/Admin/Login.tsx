import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { error } = await signIn(email, password);

        if (error) {
            setError(error);
        } else {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-body)]">
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
        </div>
    );
};

export default Login;
