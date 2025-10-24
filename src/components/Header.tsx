import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { Link as ScrollLink } from "react-scroll";
import { Bot, User, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'basic' | 'pro' | 'enterprise' | 'admin';
  avatar?: string;
}

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    // Verificar se há sessão ativa
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        const userData = JSON.parse(session);
        return {
          id: '1',
          name: userData.name,
          email: userData.email,
          plan: userData.plan
        };
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setUser(null);
    navigate('/');
  };

  const handleDashboard = () => {
    if (user) {
      const dashboards = {
        'admin': '/dashboard-admin.html',
        'basic': '/dashboard-basic.html',
        'pro': '/dashboard-pro.html',
        'enterprise': '/dashboard-enterprise.html'
      };
      window.location.href = dashboards[user.plan] || '/dashboard';
    } else {
      navigate('/dashboard');
    }
  };

  const getPlanBadge = (plan: string) => {
    const badges = {
      basic: { label: 'Básico', color: 'bg-blue-500' },
      pro: { label: 'Pro', color: 'bg-purple-500' },
      enterprise: { label: 'Enterprise', color: 'bg-orange-500' },
      admin: { label: 'Admin', color: 'bg-red-500' }
    };
    return badges[plan as keyof typeof badges] || badges.basic;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">AI Agents</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <ScrollLink
              to="pricing"
              smooth={true}
              duration={500}
              className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors"
            >
              Planos
            </ScrollLink>
            <LanguageSelector />
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-center pt-1">
                      <Badge className={`${getPlanBadge(user.plan).color} text-white text-xs`}>
                        Plano {getPlanBadge(user.plan).label}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboard} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} size="sm" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            )}
            
            <div className="md:hidden">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};