import serviceDesign from "@/assets/service-design.jpg";
import serviceSafety from "@/assets/service-safety.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Images */}
          <div className="relative">
            <img
              src={serviceDesign}
              alt="استشارات هندسية"
              className="rounded-lg w-full h-72 md:h-96 object-cover shadow-lg"
              loading="lazy"
              width={800}
              height={600}
            />
            <img
              src={serviceSafety}
              alt="سلامة هندسية"
              className="absolute -bottom-6 -left-6 w-40 h-40 md:w-52 md:h-52 rounded-lg object-cover shadow-xl border-4 border-background hidden sm:block"
              loading="lazy"
              width={800}
              height={600}
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">من نحن</h2>
            <div className="w-16 h-1 bg-accent rounded mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
              شركة أسس السلامة والعمارة للاستشارات الهندسية شركة في مجال الاستشارات الهندسية وأعمال السلامة والعمارة.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
              معاً نبني مستقبل أفضل، ولأن المملكة في طريقها نحو رؤية 2030 كان لا بد أن نطور أعمالنا ونضيف العديد من
              الخدمات المتخصصة لتلبية احتياجات السوق المتنامية.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-light rounded-lg p-4 text-center">
                <span className="text-2xl font-bold text-accent">15+</span>
                <p className="text-xs text-muted-foreground mt-1">سنة خبرة</p>
              </div>
              <div className="bg-brand-light rounded-lg p-4 text-center">
                <span className="text-2xl font-bold text-accent">350+</span>
                <p className="text-xs text-muted-foreground mt-1">مشروع منجز</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
