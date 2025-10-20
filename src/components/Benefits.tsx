import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, Target, BarChart3, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: Clock, key: "item1" },
  { icon: Target, key: "item2" },
  { icon: BarChart3, key: "item3" },
  { icon: Shield, key: "item4" },
];

export const Benefits = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("benefits.title")}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t(`benefits.${benefit.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(`benefits.${benefit.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
