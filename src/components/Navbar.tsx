import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { useScroll } from "@/components/ui/use-scroll";
import logo from "@/assets/logo.png";

const serviceLinks = [
  { label: "التصاميم والمخططات الهندسية", href: "/services/design" },
  { label: "الإشراف وإدارة المشاريع", href: "/services/supervision" },
  { label: "السلامة الهندسية", href: "/services/safety" },
  { label: "الدعم الفني والخدمات الاستشارية", href: "/services/technical" },
  { label: "الدراسات المرورية", href: "/services/traffic" },
];

const navLinks = [
  { label: "الرئيسية", href: "/#hero" },
  { label: "مشاريعنا", href: "/#projects" },
  { label: "من نحن", href: "/#about" },
  { label: "بروفايل الشركة", href: "/#profile" },
  { label: "طلب الخدمة", href: "/#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const scrolled = useScroll(10);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate(href);
  };
  // On non-home pages, always use dark text style (as if scrolled)
  const useDarkText = scrolled || !isHome;

  // Scroll-spy: track which section is currently in view
  useEffect(() => {
    if (!isHome) {
      setActiveSection("services");
      return;
    }
    const ids = ["hero", "services", "projects", "about", "profile", "contact"];
    const onScroll = () => {
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) current = id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, location.pathname]);

  const isActive = (href: string) => {
    const section = href.includes("#") ? href.split("#")[1] : href.replace("/", "");
    return activeSection === section;
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full py-2 px-4 transition-all duration-300">
      <nav
        className={cn(
          "container flex items-center justify-between h-14 md:h-16 rounded-full px-6 transition-all duration-500",
          useDarkText
            ? "bg-background/80 backdrop-blur-md border border-border/50 shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <a href="/" onClick={go("/")} className="flex items-center gap-3 relative z-50">
          <img src={logo} alt="OSAEC" className={cn("h-12 md:h-14 w-auto transition-all duration-300", useDarkText ? "" : "brightness-0 invert")} />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#hero"
            onClick={go("/#hero")}
            className={cn("relative transition-colors text-sm font-medium", useDarkText ? "text-foreground/80 hover:text-accent" : "text-primary-foreground/80 hover:text-accent", isActive("/#hero") && "text-accent")}
          >
            الرئيسية
            <span className={cn("absolute -bottom-1 right-0 left-0 h-[2px] rounded-full bg-accent transition-all duration-300", isActive("/#hero") ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0")} />
          </a>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <a
              href="/#services"
              onClick={go("/#services")}
              className={cn("relative flex items-center gap-1 transition-colors text-sm font-medium", useDarkText ? "text-foreground/80 hover:text-accent" : "text-primary-foreground/80 hover:text-accent", isActive("/#services") && "text-accent")}
            >
              خدماتنا
              <span className={cn("absolute -bottom-1 right-0 left-0 h-[2px] rounded-full bg-accent transition-all duration-300", isActive("/#services") ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0")} />
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", servicesOpen && "rotate-180")} />
            </a>

            <div
              className={cn(
                "absolute top-full right-0 mt-0 pt-2 transition-all duration-200",
                servicesOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
              )}
            >
              <div className="bg-white rounded-md shadow-xl min-w-[250px] border-t-[3px] border-accent overflow-hidden">
                {serviceLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    onClick={go(link.href)}
                    className="block px-6 py-3 text-sm text-foreground hover:bg-accent/10 hover:text-accent transition-colors border-b border-border/30 last:border-b-0"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={go(link.href)}
              className={cn("relative transition-colors text-sm font-medium", useDarkText ? "text-foreground/80 hover:text-accent" : "text-primary-foreground/80 hover:text-accent", isActive(link.href) && "text-accent")}
            >
              {link.label}
              <span className={cn("absolute -bottom-1 right-0 left-0 h-[2px] rounded-full bg-accent transition-all duration-300", isActive(link.href) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0")} />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/#contact"
            onClick={go("/#contact")}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <Phone className="w-4 h-4" />
            استشارة مجانية
          </a>
        </div>

        {/* Mobile Toggle - Animated Icon */}
        <button
          onClick={() => setOpen(!open)}
          className={cn("md:hidden p-2 relative z-50", useDarkText ? "text-foreground" : "text-primary-foreground")}
          aria-label="القائمة"
        >
          <MenuToggleIcon open={open} className="w-7 h-7" />
        </button>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-primary/98 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col",
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
          <div
            className={cn(
              "flex flex-col items-center gap-1 w-full max-w-sm transition-all duration-500 delay-100",
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <a
              href="/#hero"
              onClick={go("/#hero")}
              className="text-primary-foreground text-xl font-medium hover:text-accent transition-colors py-3 w-full text-center"
            >
              الرئيسية
            </a>

            {/* Mobile Services Accordion */}
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="flex items-center justify-center gap-2 text-primary-foreground text-xl font-medium hover:text-accent transition-colors py-3 w-full"
            >
              خدماتنا
              <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", mobileServicesOpen && "rotate-180")} />
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300 w-full",
                mobileServicesOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="flex flex-col gap-1 border-r-2 border-accent mr-auto pr-4 w-fit mx-auto">
                {serviceLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    onClick={go(link.href)}
                    className="text-primary-foreground/60 hover:text-accent transition-colors py-2 text-sm text-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={go(link.href)}
                className="text-primary-foreground text-xl font-medium hover:text-accent transition-colors py-3 w-full text-center"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            className={cn(
              "flex flex-col items-center gap-3 mt-6 w-full max-w-sm transition-all duration-500 delay-200",
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <a
              href="/#contact"
              onClick={go("/#contact")}
              className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-md text-base font-semibold hover:bg-accent/90 transition-colors w-full"
            >
              <Phone className="w-5 h-5" />
              استشارة مجانية
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
