import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });
  
  const subscription = useSubscription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscription.mutate({
      ...formData,
      plan: planId,
    }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ name: '', email: '', company: '', phone: '' });
      }
    });
  };

  return (
    <>
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
            onClick={() => setOpen(true)}
          >
            {cta}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assinar Plano {name}</DialogTitle>
          <DialogDescription>
            Preencha seus dados para começar
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={subscription.isPending}>
            {subscription.isPending ? 'Processando...' : 'Confirmar Assinatura'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};
