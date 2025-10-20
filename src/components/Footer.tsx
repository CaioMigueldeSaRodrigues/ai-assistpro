import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Agents Platform
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.links.terms")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.links.terms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.links.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.links.contact")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Social</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="text-center text-sm text-muted-foreground">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};
