import { useTranslation } from "react-i18next";
import { PricingCard } from "./PricingCard";
import { motion } from "framer-motion";

export const Pricing = () => {
  const { t } = useTranslation();

  const plans = [
    {
      planId: 'basic' as const,
      name: t("pricing.basic.name"),
      price: t("pricing.basic.price") + t("pricing.monthly"),
      badge: t("pricing.basic.badge"),
      features: [
        t("pricing.basic.feature1"),
        t("pricing.basic.feature2"),
        t("pricing.basic.feature3"),
        t("pricing.basic.feature4"),
        t("pricing.basic.feature5"),
        t("pricing.basic.feature6"),
        t("pricing.basic.feature7"),
      ],
      cta: t("pricing.basic.cta"),
      popular: false,
    },
    {
      planId: 'pro' as const,
      name: t("pricing.pro.name"),
      price: t("pricing.pro.price") + t("pricing.monthly"),
      badge: t("pricing.pro.badge"),
      features: [
        t("pricing.pro.feature1"),
        t("pricing.pro.feature2"),
        t("pricing.pro.feature3"),
        t("pricing.pro.feature4"),
        t("pricing.pro.feature5"),
        t("pricing.pro.feature6"),
        t("pricing.pro.feature7"),
        t("pricing.pro.feature8"),
        t("pricing.pro.feature9"),
      ],
      cta: t("pricing.pro.cta"),
      popular: true,
    },
    {
      planId: 'enterprise' as const,
      name: t("pricing.enterprise.name"),
      price: t("pricing.enterprise.price") + t("pricing.monthly"),
      badge: t("pricing.enterprise.badge"),
      features: [
        t("pricing.enterprise.feature1"),
        t("pricing.enterprise.feature2"),
        t("pricing.enterprise.feature3"),
        t("pricing.enterprise.feature4"),
        t("pricing.enterprise.feature5"),
        t("pricing.enterprise.feature6"),
        t("pricing.enterprise.feature7"),
        t("pricing.enterprise.feature8"),
        t("pricing.enterprise.feature9"),
        t("pricing.enterprise.feature10"),
        t("pricing.enterprise.feature11"),
        t("pricing.enterprise.feature12"),
        t("pricing.enterprise.feature13"),
      ],
      cta: t("pricing.enterprise.cta"),
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} {...plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
