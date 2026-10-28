import { useEffect, useState } from "react";
import { Send, CheckCircle2, Loader2, User, Phone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "966500003063";
const BRIDGE_URL = "/odoo-bridge.php";
const STORAGE_KEY = "osaec-service-request";

interface FormData {
  name: string;
  mobile: string;
  message: string;
  website: string; // حقل فخ ضد الروبوتات — يجب أن يبقى فارغاً
}

const emptyForm: FormData = { name: "", mobile: "", message: "", website: "" };

const validateName = (v: string) =>
  v.trim().length === 0
    ? "الاسم مطلوب"
    : v.trim().length < 3
    ? "الاسم قصير جداً"
    : v.trim().length > 100
    ? "الاسم طويل جداً"
    : "";

const validateMobile = (v: string) => {
  const digits = v.replace(/\D/g, "");
  if (digits.length === 0) return "رقم الجوال مطلوب";
  if (!/^05\d{8}$/.test(digits)) return "رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05";
  return "";
};

const validateMessage = (v: string) =>
  v.trim().length === 0
    ? "وصف الطلب مطلوب"
    : v.trim().length > 1000
    ? "وصف الطلب طويل جداً (1000 حرف كحد أقصى)"
    : "";

const validators: Record<keyof FormData, (v: string) => string> = {
  name: validateName,
  mobile: validateMobile,
  message: validateMessage,
  website: () => "",
};

interface ServiceRequestFormProps {
  serviceName?: string;
  className?: string;
}

const ServiceRequestForm = ({ serviceName, className }: ServiceRequestFormProps) => {
  const [form, setForm] = useState<FormData>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // تجاهل أي بيانات قديمة محفوظة قبل تعديل الحقول
        return { ...emptyForm, name: parsed.name ?? "", mobile: parsed.mobile ?? "", message: parsed.message ?? "" };
      }
    } catch {
      // ignore corrupted storage
    }
    return emptyForm;
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "whatsapp">("idle");

  // persist to session storage (lightweight data)
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // storage unavailable
    }
  }, [form]);

  const setField = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      setErrors((e) => ({ ...e, [field]: validators[field](value) }));
    }
  };

  const blurField = (field: keyof FormData) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validators[field](form[field]) }));
  };

  const openWhatsApp = (data: FormData) => {
    const lines = [
      "طلب خدمة جديد",
      serviceName ? `الخدمة: ${serviceName}` : null,
      `الاسم: ${data.name.trim()}`,
      `الجوال: ${data.mobile.replace(/\D/g, "")}`,
      `وصف الطلب: ${data.message.trim()}`,
    ].filter(Boolean);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const resetAfterSend = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setForm(emptyForm);
    setTouched({});
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const newErrors = {
      name: validateName(form.name),
      mobile: validateMobile(form.mobile),
      message: validateMessage(form.message),
    };
    setErrors(newErrors);
    setTouched({ name: true, mobile: true, message: true });
    if (Object.values(newErrors).some(Boolean)) return;

    setStatus("sending");
    let delivered = false;
    try {
      const res = await fetch(BRIDGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: form.mobile.replace(/\D/g, ""),
          message: form.message.trim(),
          service_name: serviceName ?? "",
          page: window.location.pathname,
          website: form.website,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        delivered = true;
        setStatus("sent");
      } else if (res.ok && data && !data.ok && data.errors) {
        // أخطاء تحقق من جهة الخادم
        setErrors((e) => ({ ...e, ...(data.errors as Record<string, string>) }));
        setStatus("idle");
        return;
      }
    } catch {
      // الشبكة أو الوسيط غير متوفر — الخطوة الاحتياطية أدناه
    }

    if (!delivered) {
      // الوسيط غير جاهز أو تعذر الوصول لأودو → واتساب تلقائياً حتى لا يضيع الطلب
      openWhatsApp(form);
      setStatus("whatsapp");
    }
    resetAfterSend();
  };

  const inputClass = (field: keyof FormData) =>
    cn(
      "w-full bg-background border rounded-xl px-4 py-3.5 text-sm shadow-sm transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:border-accent/60 hover:border-accent/40",
      touched[field] && errors[field]
        ? "border-destructive focus:ring-destructive/40"
        : "border-border focus:ring-accent/40"
    );

  const iconClass = "absolute start-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 w-[18px] h-[18px] text-muted-foreground pointer-events-none";

  return (
    <form className={cn("space-y-5", className)} onSubmit={handleSubmit} noValidate>
      <div>
        <div className="relative">
          <User className={iconClass} strokeWidth={1.75} />
          <input
            type="text"
            placeholder="الإسم"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => blurField("name")}
            maxLength={100}
            className={cn(inputClass("name"), "pr-12")}
            aria-invalid={Boolean(touched.name && errors.name)}
          />
        </div>
        {touched.name && errors.name && (
          <p className="text-destructive text-xs mt-1.5">{errors.name}</p>
        )}
      </div>

      <div>
        <div className="relative">
          <Phone className={iconClass} strokeWidth={1.75} />
          <input
            type="tel"
            dir="ltr"
            placeholder="رقم الجوال (05xxxxxxxx)"
            value={form.mobile}
            onChange={(e) => setField("mobile", e.target.value)}
            onBlur={() => blurField("mobile")}
            maxLength={13}
            className={cn(inputClass("mobile"), "text-right placeholder:text-right pr-12 pl-4")}
            aria-invalid={Boolean(touched.mobile && errors.mobile)}
          />
        </div>
        {touched.mobile && errors.mobile && (
          <p className="text-destructive text-xs mt-1.5">{errors.mobile}</p>
        )}
      </div>

      <div>
        <div className="relative">
          <FileText className="absolute start-3.5 top-4 w-[18px] h-[18px] text-muted-foreground pointer-events-none" strokeWidth={1.75} />
          <textarea
            placeholder="وصف الطلب"
            rows={4}
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            onBlur={() => blurField("message")}
            maxLength={1000}
            className={cn(inputClass("message"), "resize-none pt-3.5 pr-12")}
            aria-invalid={Boolean(touched.message && errors.message)}
          />
        </div>
        {touched.message && errors.message && (
          <p className="text-destructive text-xs mt-1.5">{errors.message}</p>
        )}
      </div>

      {/* حقل فخ ضد الروبوتات — مخفي عن الزوار */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => setField("website", e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3.5 rounded-xl font-bold shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            جارٍ الإرسال...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            إرسال الطلب
          </>
        )}
      </button>

      {status === "sent" && (
        <p className="flex items-center justify-center gap-2 text-sm text-foreground font-medium">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          تم إرسال طلبك بنجاح — سيتواصل معك فريقنا قريباً
        </p>
      )}
      {status === "whatsapp" && (
        <p className="flex items-center justify-center gap-2 text-sm text-foreground font-medium">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          تم فتح واتساب — اضغط "إرسال" داخل التطبيق لتوصيل طلبك
        </p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        يصل طلبك مباشرة إلى نظام إدارة العملاء لدينا
      </p>
    </form>
  );
};

export default ServiceRequestForm;
