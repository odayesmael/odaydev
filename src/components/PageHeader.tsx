import logoMark from "@/assets/oday-mark.svg";
import { useMessages } from "@/i18n";
import { EmailLink } from "./EmailLink";
import { LangSwitch } from "./LangSwitch";
import { PaletteButton } from "./CommandPaletteHost";
import { LocaleLink } from "./LocaleLink";

/** Top bar for inner pages: logo home, language switch, contact. */
export function PageHeader() {
  const t = useMessages();
  return (
    <header className="dr-page-top">
      <LocaleLink to="/" className="logo dr-logo">
        <img className="icon" src={logoMark} alt="" />
        <span className="logo-word">
          oday<span className="logo-dot">.</span>
        </span>
      </LocaleLink>
      <div className="top-actions">
        <PaletteButton label={t.palette.trigger} />
        <LangSwitch />
        <EmailLink className="contact-btn">
          {t.common.letsTalk} <span className="arrow">↗</span>
        </EmailLink>
      </div>
    </header>
  );
}
