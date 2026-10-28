import { Phone, Mail, MapPin } from "lucide-react";
import ServiceRequestForm from "@/components/ServiceRequestForm";

const CTASection = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-brand-light">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">طلب الخدمة</h2>
          <p className="text-muted-foreground text-sm md:text-base">املأ النموذج ببياناتك وسيصل طلبك مباشرة إلى فريقنا، وسنعاود التواصل معك في أقرب وقت</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">اتصل بنا</h3>
                <p className="text-muted-foreground text-sm" dir="ltr">
                  +966 500003063
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">البريد الإلكتروني</h3>
                <p className="text-muted-foreground text-sm">info@osaec.com.sa</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">العنوان</h3>
                <p className="text-muted-foreground text-sm">
                  {" "}
                  المملكة العربية السعودية - الرياض - المهدية - حي الدهناء
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ServiceRequestForm className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
