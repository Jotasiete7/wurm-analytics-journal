const Spinner = ({ message = "Loading..." }: { message?: string }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-body)] opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-border)] border-t-[var(--color-accent)] mb-4"></div>
            <span className="animate-pulse font-mono text-sm">{message}</span>
        </div>
    );
};

export default Spinner;
