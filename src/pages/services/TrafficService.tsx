import { TrafficCone, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";

const features = [
  "دراسات وتحليل السلامة المرورية",
  "تصميم الإشارات والعلامات المرورية",
  "تقييم الأثر المروري للمشاريع",
  "تخطيط شبكات الطرق والتقاطعات",
  "دراسات مواقف السيارات",
  "حلول إدارة الحركة المرورية",
];

const TrafficService = () => (
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
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
              <TrafficCone className="w-10 h-10 text-orange-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">الدراسات المرورية</h1>
            <p className="text-muted-foreground leading-relaxed mb-8">
              نضم في شركتنا العديد من الكوادر الفنية ذات الخبرات العالية في دراسات وتحليل السلامة المرورية وتقديم الحلول المرورية المتكاملة.
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

export default TrafficService;
