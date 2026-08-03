import { Link } from "@tanstack/react-router";
import { Mail, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-columns">
        <div className="sf-col">
          <div className="sf-label">[ SERVICES ]</div>
          <ul>
            <li><a href="#services">Web Design</a></li>
            <li><a href="#services">Web Development</a></li>
            <li><a href="#services">SEO Optimization</a></li>
            <li><a href="#services">UI / UX Design</a></li>
          </ul>
        </div>
        <div className="sf-col">
          <div className="sf-label">[ EXPLORE ]</div>
          <ul>
            <li><a href="#skills">Skills</a></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="sf-col">
          <div className="sf-label">[ CONNECT ]</div>
          <ul>
            <li>
              <a href="mailto:odaiesmael303@gmail.com" className="sf-icon-link" aria-label="Email">
                <Mail size={24} />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/oday-alatbash/" target="_blank" rel="noopener noreferrer" className="sf-icon-link" aria-label="LinkedIn">
                <Linkedin size={24} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="sf-divider" />

      <div className="sf-bottom">
        <span>© {new Date().getFullYear()} Oday — Full-Stack Web Developer.</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
}
