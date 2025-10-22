import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PricingCardProps {
  name: string;
  price: string;
  badge: string;
  features: string[];
  cta: string;
  popular?: boolean;
  index: number;
  planId: 'basic' | 'pro' | 'enterprise';
}

export const PricingCard = ({
  name,
  price,
  badge,
  features,
  cta,
  popular = false,
  index,
  planId,
}: PricingCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2",
          popular
            ? "border-primary shadow-lg scale-105 bg-gradient-to-b from-primary/5 to-background"
            : "border-border/50 bg-card/50 backdrop-blur"
        )}
      >
        {popular && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        )}

        <CardHeader className="text-center pb-8">
          <Badge
            variant={popular ? "default" : "secondary"}
            className="mb-4 self-center"
          >
            {badge}
          </Badge>
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {price}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button
            className={cn(
              "w-full",
              popular
                ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                : ""
            )}
            variant={popular ? "default" : "outline"}
            size="lg"
            onClick={() => navigate(`/checkout/${planId}`)}
          >
            {cta}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
