import { Home, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface BreadcrumbsProps {
    items: Array<{
        label: string;
        href?: string;
    }>;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-wurm-muted mb-8">
            <NavLink
                to="/"
                className="hover:text-wurm-accent transition-colors flex items-center gap-1"
                title="Home"
            >
                <Home size={12} />
            </NavLink>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight size={12} className="text-wurm-border" />
                    {item.href ? (
                        <NavLink
                            to={item.href}
                            className="hover:text-wurm-accent transition-colors"
                        >
                            {item.label}
                        </NavLink>
                    ) : (
                        <span className="text-wurm-text">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
