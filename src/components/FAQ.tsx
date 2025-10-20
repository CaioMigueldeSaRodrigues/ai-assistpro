import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = ["q1", "q2", "q3", "q4", "q5"];

export const FAQ = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("faq.title")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {questions.map((q, index) => (
              <AccordionItem
                key={q}
                value={q}
                className="border border-border/50 rounded-lg px-6 bg-card/50 backdrop-blur"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{t(`faq.${q}.question`)}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t(`faq.${q}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
