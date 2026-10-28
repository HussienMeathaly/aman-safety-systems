import { ShieldCheck, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

const features = [
  "تقييم المخاطر وإعداد خطط السلامة",
  "خطط الطوارئ والإخلاء",
  "تدريب فرق العمل على إجراءات السلامة",
  "فحص وتدقيق أنظمة الحماية من الحريق",
  "الامتثال لمعايير الدفاع المدني",
  "تقارير السلامة الدورية والتوصيات",
];

const SafetyService = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-brand-light">
      <div className="container">
        <Link to="/" className="inline-flex items-center gap-2 text-accent hover:underline mb-8 text-sm font-medium">
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-teal-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">السلامة الهندسية</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              أحد أهم أقسام الشركة والذي يقدم حلول سلامة متكاملة تشمل تقييم المخاطر وخطط الطوارئ والتدريب، مع الالتزام بجميع اشتراطات الدفاع المدني والجهات المعنية.
            </p>
            <Link to="/#contact" className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-md text-sm font-semibold hover:bg-accent/90 transition-colors">
              طلب الخدمة
            </Link>
          </div>
          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border hover:border-accent/20 transition-colors">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    <CTASection />
    <Footer />
  </div>
);

export default SafetyService;
