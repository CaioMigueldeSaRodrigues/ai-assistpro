import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import heroImage from "@/assets/hero-ai-agent.jpg";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container px-4 py-20 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                {t("hero.badge1")}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-success text-success">
                {t("hero.badge2")}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
              {t("hero.title")}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <ScrollLink to="pricing" smooth={true} duration={500}>
                <Button size="lg" className="w-full sm:w-auto group bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all">
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </ScrollLink>
              
              <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                <Play className="mr-2 h-4 w-4" />
                {t("hero.ctaSecondary")}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img
                src={heroImage}
                alt="AI Agent Dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
