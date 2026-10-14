import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { Link as ScrollLink } from 'react-scroll';
import { Bot, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.name.split(' ').map((part) => part[0]).join('').toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4 mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center"><Bot className="h-6 w-6 text-primary-foreground" /></div>
          <span className="font-bold text-lg hidden sm:inline">AI Agents</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <ScrollLink to="pricing" smooth duration={500} className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors">Planos</ScrollLink>
          <LanguageSelector />
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="relative h-10 w-10 rounded-full"><Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback></Avatar></Button></DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback></Avatar><div><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div></div>
                  <div className="flex justify-center pt-1"><Badge variant="secondary">Plano {user.plan}</Badge></div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer"><UserIcon className="mr-2 h-4 w-4" />Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600"><LogOut className="mr-2 h-4 w-4" />Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : <Button onClick={() => navigate('/login')} size="sm"><LogIn className="h-4 w-4 mr-2" />Entrar</Button>}
          <div className="md:hidden"><LanguageSelector /></div>
        </div>
      </div>
    </header>
  );
};
