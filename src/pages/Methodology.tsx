const Methodology = () => {
    return (
        <article className="p-8">
            <header className="mb-8 border-b border-[var(--color-border)] pb-8 bg-grid-pattern">
                <div className="font-mono text-[var(--color-gold-matte)] uppercase tracking-wider text-xs mb-2">System Protocols</div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Research Methodology</h1>
            </header>

            <div className="prose prose-invert prose-sm max-w-none text-[var(--color-text-secondary)]">
                <p>
                    All data presented in this archive is gathered under strictly controlled conditions to ensure accuracy and repeatability.
                </p>

                <h3 className="text-[var(--color-text-primary)] mt-8 mb-4">Testing Environment</h3>
                <p>
                    Orsha Research Station (in-game) is used as a controlled testing site. This environment allows for the isolation of variables such as terrain slope, tool quality, skill level, and tick rates.
                </p>

                <h3 className="text-[var(--color-text-primary)] mt-8 mb-4">Data Integrity</h3>
                <ul className="list-disc pl-4 space-y-2">
                    <li>Minimum sample sizes are strictly enforced (n &gt; 100 for linear probabilities, n &gt; 1000 for complex curves).</li>
                    <li>Outliers are documented but excluded from primary regression models unless significant.</li>
                    <li>All tests are conducted on the live server environment unless otherwise noted.</li>
                </ul>

                <h3 className="text-[var(--color-text-primary)] mt-8 mb-4">Content Classification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 not-prose">
                    <div className="border border-[var(--color-border)] p-4 bg-[var(--color-bg-subtle)]">
                        <div className="font-mono text-[var(--color-gold-matte)] text-xs uppercase mb-1">Analysis</div>
                        <div className="text-xs">Deep dives into specific mechanics with interpretative conclusions.</div>
                    </div>
                    <div className="border border-[var(--color-border)] p-4 bg-[var(--color-bg-subtle)]">
                        <div className="font-mono text-[var(--color-gold-matte)] text-xs uppercase mb-1">Statistics</div>
                        <div className="text-xs">Raw data sets, probability tables, and regression graphs.</div>
                    </div>
                    <div className="border border-[var(--color-border)] p-4 bg-[var(--color-bg-subtle)]">
                        <div className="font-mono text-[var(--color-gold-matte)] text-xs uppercase mb-1">Investigations</div>
                        <div className="text-xs">Hypothesis-driven testing logs and experimental results.</div>
                    </div>
                    <div className="border border-[var(--color-border)] p-4 bg-[var(--color-bg-subtle)]">
                        <div className="font-mono text-[var(--color-gold-matte)] text-xs uppercase mb-1">Guides</div>
                        <div className="text-xs">Practical application manuals derived from confirmed research.</div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Methodology;
