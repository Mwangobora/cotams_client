import { cn } from '@/lib/utils';
import { type NavGroup } from '@/config/navigation.config';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

interface SidebarProps {
  navigation: NavGroup[];
  className?: string;
}

export function Sidebar({ navigation, className }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={cn('flex h-full flex-col border-r bg-card', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg">COTAMS</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-6">
          {navigation.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {group.title && (
                <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3',
                        isActive && 'bg-secondary font-medium'
                      )}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground text-center">
          v1.0.0
        </div>
      </div>
    </div>
  );
}
