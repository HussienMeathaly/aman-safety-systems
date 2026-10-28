import { useEffect, useRef, useState } from "react";
import { Award, FileText, Rocket, UserPlus } from "lucide-react";
import { useGlowBorder } from "@/hooks/useGlowBorder";

const stats = [
  { value: 20, suffix: "", label: "سنوات الخبرة", icon: Award, accent: "hsl(48, 96%, 53%)" },
  { value: 54, suffix: "", label: "مشاريع جاري العمل عليها", icon: FileText, accent: "hsl(217, 91%, 60%)" },
  { value: 1800, suffix: "+", label: "مشاريع مكتملة", icon: Rocket, accent: "hsl(0, 78%, 50%)" },
  { value: 2593, suffix: "+", label: "عميل سعيد", icon: UserPlus, accent: "hsl(199, 89%, 48%)" },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const formatted = count.toLocaleString("en-US");

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-foreground">
      {suffix && <span className="ml-1">{suffix}</span>}
      {formatted}
    </div>
  );
};

const StatCard = ({ stat }: { stat: typeof stats[0] }) => {
  const { ref, glowStyle } = useGlowBorder<HTMLDivElement>(stat.accent);
  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      style={glowStyle}
      className="relative rounded-2xl border-2 bg-card p-6 md:p-8 text-center transition-all duration-500 hover:-translate-y-1"
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 8px 32px -4px ${stat.accent.replace(')', ' / 0.45)')}`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div className="mb-4 inline-flex" style={{ color: stat.accent }}>
        <Icon className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
      </div>
      <CountUp target={stat.value} suffix={stat.suffix} />
      <p className="mt-2 text-sm md:text-base font-medium text-muted-foreground">
        {stat.label}
      </p>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            سنوات من النجاح والإنجازات
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            خدمات هندسية متكاملة من التصميم حتى التسليم
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
