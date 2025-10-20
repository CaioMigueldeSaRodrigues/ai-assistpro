import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import { Link as ScrollLink } from "react-scroll";
import { Bot } from "lucide-react";

export const Header = () => {
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

          <div className="md:hidden">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  );
};
