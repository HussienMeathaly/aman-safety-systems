import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
          {/* About */}
          <div>
            <img src={logo} alt="OSAEC" className="h-14 w-auto brightness-0 invert mb-4" />
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              شركة رائدة في المملكة العربية السعودية في مجال الاستشارات الهندسية والسلامة والعمارة. معاً نبني مستقبل
              أفضل نحو رؤية 2030.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4">القائمة</h3>
            <ul className="space-y-2">
              {[
                { label: "الرئيسية", href: "#hero" },
                { label: "خدماتنا", href: "#services" },
                { label: "مشاريعنا", href: "#projects" },
                { label: "من نحن", href: "#about" },
                { label: "طلب الخدمة", href: "#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-base mb-4">الخدمات</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>التصميم المعماري</li>
              <li>الإشراف وإدارة المشاريع</li>
              <li>السلامة الهندسية</li>
              <li>السلامة المرورية</li>
              <li>الأعمال المساحية</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center text-primary-foreground/40 text-xs">
          © {new Date().getFullYear()} شركة أسس السلامة والعمارة للاستشارات الهندسية. جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
};

export default Footer;
