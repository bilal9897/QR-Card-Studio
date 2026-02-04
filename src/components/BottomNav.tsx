import { Home, Sparkles, Layers, Info } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface BottomNavProps {
    onAboutClick: () => void;
}

export default function BottomNav({ onAboutClick }: BottomNavProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const navItems = [
        {
            icon: Home,
            label: 'Home',
            path: '/',
            onClick: () => navigate('/')
        },
        {
            icon: Sparkles,
            label: 'Create',
            path: '/create',
            onClick: () => {
                if (location.pathname !== '/create') {
                    navigate('/create');
                } else {
                    // Scroll to top if already on create page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        },
        {
            icon: Layers,
            label: 'Templates',
            path: '/templates',
            onClick: () => navigate('/templates')
        },
        {
            icon: Info,
            label: 'About',
            path: '/about',
            onClick: onAboutClick
        }
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-white/10 safe-area-inset-bottom">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <button
                            key={item.path}
                            onClick={item.onClick}
                            className={`
                flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl
                transition-all duration-200 min-w-[70px]
                ${active
                                    ? 'text-[#c9a961] bg-[#c9a961]/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }
              `}
                            aria-label={item.label}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Icon
                                className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`}
                                strokeWidth={active ? 2.5 : 2}
                            />
                            <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
