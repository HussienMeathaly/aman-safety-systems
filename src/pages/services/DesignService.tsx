import { Ruler, CheckCircle, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

interface ServiceFeature {
  title: string;
  image?: string;
  details?: string[];
}

const features: ServiceFeature[] = [
  {
    title: "التصميم المعماري",
    image: "/services/architectural-plan.png",
    details: [
      "إعداد التصاميم المعمارية للمباني السكنية والتجارية والإدارية",
      "تصميم الفلل والعمائر والمجمعات السكنية",
      "تصميم الواجهات المعمارية الحديثة والتراثية",
      "إعداد المخططات المعمارية التفصيلية والتنفيذية",
      "إعداد المخططات اللازمة لإصدار رخص البناء",
      "تصميم وتنسيق الفراغات الداخلية (Interior Design)",
      "إعداد النماذج ثلاثية الأبعاد (3D Visualization)",
      "إعداد جداول التشطيبات والمواد المعمارية",
    ],
  },
  {
    title: "التصميم الانشائي",
    image: "/services/structural-design.png",
    details: [
      "التصميم الإنشائي للمباني الخرسانية بأنواعها طبقاً للكود السعودي",
      "اختيار الأنظمة الإنشائية الأكثر أماناً واقتصاداً",
      "إعداد المخططات الإنشائية التنفيذية",
      "تصميم المنشآت الخاصة (الخزانات، الهناجر، المنشآت الصناعية)",
      "مراجعة وتدقيق التصاميم الإنشائية",
      "إعداد التقارير الفنية والدراسات الإنشائية",
      "تقييم سلامة المنشآت القائمة",
    ],
  },
  { title: "المخططات الكهربائية" },
  { title: "التصميم الداخلي" },
  { title: "الأعمال المساحية" },
  { title: "المخططات الميكانيكية" },
];

const FeatureAccordion = ({ feature }: { feature: ServiceFeature }) => {
  const [open, setOpen] = useState(false);
  const hasContent = feature.details || feature.image;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden transition-colors hover:border-accent/20">
      <button
        onClick={() => hasContent && setOpen(!open)}
        className="flex items-center justify-between w-full gap-3 p-4 text-right"
        disabled={!hasContent}
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-accent shrink-0" />
          <span className="text-foreground text-sm font-medium">{feature.title}</span>
        </div>
        {hasContent && (
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-5">
          <div className={`flex gap-5 ${feature.image ? "flex-col md:flex-row items-start" : ""}`}>
            {feature.image && (
              <div className="md:w-2/5 shrink-0 rounded-xl overflow-hidden border-2 border-accent/10 shadow-md
                rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-auto object-contain bg-white p-2"
                  loading="lazy"
                />
              </div>
            )}
            {feature.details && (
              <ul className="space-y-2.5 pr-2 flex-1">
                {feature.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DesignService = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-brand-light">
      <div className="container">
        <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mb-8 text-sm font-medium">
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-3">
            {features.map((f, i) => (
              <FeatureAccordion key={i} feature={f} />
            ))}
          </div>
          <div>
            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
              <Ruler className="w-10 h-10 text-accent" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
              التصاميم والمخططات الهندسية
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              يوفر مكتبنا أعلى مستوى من خدمات التصميم المتكامل من خلال فريق عمل متخصص من المهندسين ذوي
              الخبرات العالية في مجالات التصميم المختلفة، وذلك من خلال استخدام برامج تصميم ومناهج تحليل هندسي
              حديثة ودراية كاملة بأنظمة البناء العالمية والمحلية وتعتمد عملية التصميم
              الهندسي في مكتبنا على ثلاث اعتبارات رئيسية هي سهولة الإنشاء والجودة مقابل الكلفة
              والكفاءة الوظيفية حيث تقود هذه العناصر الفريق الهندسي المصمم لإيجاد حلول
              التصميم النهائية المثلى وفق رؤية واحتياجات العملاء.
            </p>
            <Link
              to="/#contact"
              className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-md text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              طلب الخدمة
            </Link>
          </div>
        </div>
      </div>
    </section>
    <CTASection />
    <Footer />
  </div>
);

export default DesignService;
