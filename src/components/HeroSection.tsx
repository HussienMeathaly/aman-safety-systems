import { useState, useEffect, useCallback } from "react";
import heroBg1 from "@/assets/hero-bg.jpg";
import heroBg2 from "@/assets/hero-bg-2.jpg";
import heroBg3 from "@/assets/hero-bg-3.jpg";
import heroBg4 from "@/assets/hero-bg-4.jpg";

const slides = [
  { image: heroBg1, title: "شركة أسس السلامة والعمارة", subtitle: "بيئـة هندسية متكاملة مـن التصميم حتى التسلـيم" },
  { image: heroBg2, title: "استشارات هندسية متخصصة", subtitle: "فريق من الخبراء لتقديم أفضل الحلول الهندسية" },
  { image: heroBg3, title: "إشراف وإدارة المشاريع", subtitle: "نضمن تنفيذ مشاريعكم بأعلى معايير الجودة" },
  { image: heroBg4, title: "تصاميم عصرية مبتكرة", subtitle: "نحوّل رؤيتكم إلى واقع معماري متميز" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [isTransitioning],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background images */}
      {slides.map((slide, i) => (
        <img
          key={i}
          src={slide.image}
          alt="خلفية"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-in-out ${
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
          width={1920}
          height={1080}
          {...(i === 0 ? {} : { loading: "lazy" as const })}
        />
      ))}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 container text-center text-primary-foreground px-4 pt-20">
        <h1
          key={`title-${current}`}
          className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 animate-fade-in-up"
        >
          {slides[current].title}
        </h1>
        <p
          key={`sub-${current}`}
          className="text-lg md:text-2xl font-light text-primary-foreground/80 mb-3 animate-fade-in-up animation-delay-200"
        >
          {slides[current].subtitle}
        </p>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8 animate-fade-in-up animation-delay-400">
          شركة رائدة في المملكة العربية السعودية في مجال الاستشارات الهندسية والسلامة والعمارة. معاً نبني مستقبل أفضل
          نحو رؤية 2030.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
          <a
            href="#contact"
            className="bg-accent text-accent-foreground px-8 py-3.5 rounded-md font-semibold hover:bg-accent/90 transition-colors text-base"
          >
            لطلب خدمة
          </a>
          <a
            href="#services"
            className="border-2 border-primary-foreground/40 text-primary-foreground px-8 py-3.5 rounded-md font-semibold hover:bg-primary-foreground/10 transition-colors text-base"
          >
            خدماتنا
          </a>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2.5 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-8 h-3 bg-accent" : "w-3 h-3 bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
              aria-label={`الانتقال للشريحة ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
