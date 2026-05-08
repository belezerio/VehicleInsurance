import { Link } from 'react-router-dom';
import { Shield, Mail, MapPin, Phone, ArrowUp, Globe, ExternalLink } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Car Insurance', href: '/#categories' },
    { label: 'Bike Insurance', href: '/#categories' },
    { label: 'Truck Insurance', href: '/#categories' },
    { label: 'CamperVan Insurance', href: '/#categories' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'File a Claim', href: '/my-claims' },
    { label: 'FAQs', href: '/#faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Licenses', href: '#' },
  ],
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20">
      {/* Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top Section — Logo + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                <Shield size={22} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SecureDrive</span>
            </Link>
            <p className="text-[var(--text-secondary)] max-w-md leading-relaxed">
              Next-generation vehicle insurance platform. Fast claims, comprehensive coverage,
              and 24/7 premium support tailored for modern drivers.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-glass)] flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                <Globe size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-glass)] flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                <ExternalLink size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-glass)] flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all">
                <Mail size={16} />
              </a>
            </div>
          </div>

          <div className="lg:max-w-sm lg:ml-auto">
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">Stay Updated</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              Get the latest insurance tips and platform updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]
                  text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]
                  focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold
                hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:brightness-110 flex-shrink-0">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[var(--text-primary)] font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[var(--text-muted)] text-sm hover:text-indigo-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Bar */}
        <div className="flex flex-wrap items-center gap-6 mb-12 py-6 px-6 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-glass)]">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Mail size={14} className="text-indigo-400" />
            <span>support@securedrive.io</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Phone size={14} className="text-indigo-400" />
            <span>+91 1800-XXX-XXXX</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <MapPin size={14} className="text-indigo-400" />
            <span>Mumbai, Maharashtra, India</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[var(--border-glass)]">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} SecureDrive. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 w-9 h-9 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-glass)] flex items-center justify-center
              text-[var(--text-muted)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all hover:-translate-y-0.5"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
