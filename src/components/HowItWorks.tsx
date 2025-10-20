import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { UserPlus, Palette, Plug, Rocket } from "lucide-react";

const steps = [
  { icon: UserPlus, key: "step1" },
  { icon: Palette, key: "step2" },
  { icon: Plug, key: "step3" },
  { icon: Rocket, key: "step4" },
];

export const HowItWorks = () => {
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
            {t("howItWorks.title")}
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" 
                 style={{ width: "75%", left: "12.5%" }} />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 relative z-10 border-4 border-background shadow-lg">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 -z-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t(`howItWorks.${step.key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`howItWorks.${step.key}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
