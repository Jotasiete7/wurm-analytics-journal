import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

const isDevelopment = import.meta.env.DEV;

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ errorInfo });

        // TODO: Log to external service (Sentry, LogRocket, etc.)
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full space-y-6 text-center">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-wurm-warning/10 border border-wurm-warning/20">
                                <AlertTriangle size={48} className="text-wurm-warning" />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-serif font-bold text-wurm-text">
                                Something went wrong
                            </h1>
                            <p className="text-wurm-muted">
                                We encountered an unexpected error. Please try again.
                            </p>
                        </div>

                        {/* Error details (dev mode only) */}
                        {isDevelopment && this.state.error && (
                            <details className="text-left p-4 bg-wurm-panel border border-wurm-border rounded">
                                <summary className="cursor-pointer text-sm font-mono text-wurm-muted mb-2">
                                    Error Details
                                </summary>
                                <pre className="text-xs text-wurm-text overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && (
                                        <>
                                            {'\n\n'}
                                            {this.state.errorInfo.componentStack}
                                        </>
                                    )}
                                </pre>
                            </details>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 px-4 py-2 bg-wurm-accent text-black font-medium hover:bg-wurm-accent-dim transition-colors"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                            <NavLink
                                to="/"
                                className="flex items-center gap-2 px-4 py-2 border border-wurm-border text-wurm-text hover:border-wurm-accent hover:text-wurm-accent transition-colors"
                            >
                                <Home size={16} />
                                Go Home
                            </NavLink>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
