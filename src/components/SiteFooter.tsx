import { Mail, Linkedin, Github } from "lucide-react";
import { EmailLink } from "@/components/EmailLink";
import { LocaleLink } from "./LocaleLink";
import { localePath, useLocale, useMessages } from "@/i18n";

export function SiteFooter() {
  const t = useMessages();
  const home = localePath(useLocale(), "/");
  return (
    <footer className="site-footer">
      <div className="sf-columns">
        <div className="sf-col">
          <div className="sf-label">[ {t.footer.services} ]</div>
          <ul>
            {t.services.items.map((item) => (
              <li key={item.title}>
                <a href={`${home}#services`}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="sf-col">
          <div className="sf-label">[ {t.footer.explore} ]</div>
          <ul>
            <li>
              <a href={`${home}#skills`}>{t.footer.skills}</a>
            </li>
            <li>
              <LocaleLink to="/portfolio">{t.footer.portfolio}</LocaleLink>
            </li>
            <li>
              <LocaleLink to="/work/shustyle">{t.footer.shustyle}</LocaleLink>
            </li>
            <li>
              <LocaleLink to="/blog">{t.footer.blog}</LocaleLink>
            </li>
            <li>
              <a href={`${home}#contact`}>{t.footer.contact}</a>
            </li>
          </ul>
        </div>
        <div className="sf-col">
          <div className="sf-label">[ {t.footer.connect} ]</div>
          <ul>
            <li>
              <EmailLink className="sf-icon-link" aria-label="Email">
                <Mail size={24} />
              </EmailLink>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/oday-alatbash/"
                target="_blank"
                rel="noopener noreferrer"
                className="sf-icon-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/odayesmael"
                target="_blank"
                rel="noopener noreferrer"
                className="sf-icon-link"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="sf-divider" />

      <div className="sf-bottom">
        <span>
          © {new Date().getFullYear()} Oday — {t.footer.role}.
        </span>
        <span>{t.footer.rights}</span>
      </div>
    </footer>
  );
}
