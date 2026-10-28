import { Ruler, HardHat, ShieldCheck, Wrench, TrafficCone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGlowBorder } from "@/hooks/useGlowBorder";

const services = [
  {
    icon: Ruler,
    title: "التصاميم والمخططات الهندسية",
    description: "يتخصص مهندسونا في تقديم خدمات التصميم بكافة مراحله بدءاً من إعداد التصاميم الأولية وانتهاءً بالمخططات التنفيذية.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    accent: "hsl(0, 78%, 50%)",
    delay: 0,
    href: "/services/design",
  },
  {
    icon: HardHat,
    title: "الإشراف وإدارة المشاريع",
    description: "نضم في شركتنا العديد من الكوادر الفنية ذات الخبرات العالية في الإشراف على تنفيذ المشاريع الهندسية.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    accent: "hsl(38, 92%, 50%)",
    delay: 1,
    href: "/services/supervision",
  },
  {
    icon: ShieldCheck,
    title: "السلامة الهندسية",
    description: "أحد أهم أقسام الشركة والذي يقدم حلول سلامة متكاملة تشمل تقييم المخاطر وخطط الطوارئ والتدريب.",
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    accent: "hsl(162, 63%, 41%)",
    delay: 2,
    href: "/services/safety",
  },
  {
    icon: Wrench,
    title: "الدعم الفني والخدمات الاستشارية",
    description: "نقدم حلولاً تقنية متخصصة وتوجيهات لضمان تنفيذ المشاريع بكفاءة وفق المعايير الهندسية المطلوبة.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    accent: "hsl(239, 84%, 67%)",
    delay: 3,
    href: "/services/technical",
  },
  {
    icon: TrafficCone,
    title: "الدراسات المرورية",
    description: "نضم في شركتنا العديد من الكوادر الفنية ذات الخبرات العالية في دراسات وتحليل السلامة المرورية.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    accent: "hsl(25, 95%, 53%)",
    delay: 4,
    href: "/services/traffic",
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { ref: glowRef, glowStyle } = useGlowBorder<HTMLDivElement>(service.accent);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (glowRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      style={{ ...glowStyle, transitionDelay: `${index * 150}ms` }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 12px 40px -6px ${service.accent.replace(')', ' / 0.4)')}`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
      className={`bg-card rounded-2xl p-6 md:p-8 border-2 group cursor-pointer
        transition-all duration-700 ease-out text-center
        hover:-translate-y-3
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
    >
      {/* Animated Icon Container */}
      <div className="flex justify-center mb-6">
        <div className={`relative w-28 h-28 md:w-36 md:h-36 ${service.bgColor} rounded-2xl flex items-center justify-center
          transition-all duration-500 group-hover:scale-110 group-hover:rounded-3xl`}
        >
          <span className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-accent/30 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
          <span className="absolute top-1/2 -left-3 w-2.5 h-2.5 rounded-full bg-accent/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />

          <service.icon
            className={`w-14 h-14 md:w-20 md:h-20 ${service.color} transition-transform duration-500`}
            style={{
              animation: `serviceFloat 3s ease-in-out infinite`,
              animationDelay: `${service.delay * 0.4}s`,
            }}
            strokeWidth={1.5}
          />
        </div>
      </div>

      <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 font-heading">{service.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-xs mx-auto">{service.description}</p>
      <a
        href={service.href}
        className="inline-block bg-accent text-accent-foreground px-6 py-2.5 rounded-full text-sm font-semibold
          hover:bg-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
      >
        للمزيد من التفاصيل
      </a>
    </div>
  );
};

const ServicesSection = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-16 md:py-24 bg-brand-light">
      <style>{`
        @keyframes serviceFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      <div className="container">
        <div
          ref={headerRef}
          className={`text-center mb-14 transition-all duration-700 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-3 font-heading">خدماتنا</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            نحن في أسس السلامة والعمارة للاستشارات الهندسية نقدم خدمات هندسية متكاملة من التصميم حتى التسليم
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
