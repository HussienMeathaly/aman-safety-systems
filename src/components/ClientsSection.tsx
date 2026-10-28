const clients = [
  { name: "الهيئة العامة للعقار", logo: "/clients/client-1.png" },
  { name: "السعودية", logo: "/clients/client-2.png" },
  { name: "هيرفي", logo: "/clients/client-3.png" },
  { name: "ساسكو SASCO", logo: "/clients/client-4.png" },
  { name: "المسجد الحرام", logo: "/clients/client-5.png" },
  { name: "الفنار alfanar", logo: "/clients/client-6.png" },
  { name: "أزاد العقارية", logo: "/clients/client-7.png" },
  { name: "ضمان للممتلكات", logo: "/clients/client-8.png" },
  { name: "عبداللطيف جميل", logo: "/clients/client-9.png" },
  { name: "صلة sela", logo: "/clients/client-10.png" },
  { name: "موانئ دبي العالمية DP World", logo: "/clients/client-11.png" },
  { name: "AHC أول القابضة", logo: "/clients/client-12.png" },
  { name: "شادن SHADEN RESORT", logo: "/clients/client-13.png" },
  { name: "رافال RAFAL", logo: "/clients/client-14.png" },
  { name: "السدحان", logo: "/clients/client-15.png" },
  { name: "النهدي nahdi", logo: "/clients/client-16.png" },
  { name: "NAFFCO", logo: "/clients/client-17.png" },
  { name: "وزارة الصحة", logo: "/clients/client-18.png" },
  { name: "مجموعة الباتعي", logo: "/clients/client-19.png" },
  { name: "ابيات", logo: "/clients/client-20.png" },
  { name: "مستشفيات دله", logo: "/clients/client-21.png" },
];

const ClientLogo = ({ client }: { client: { name: string; logo: string } }) => (
  <div className="flex-shrink-0 px-6 md:px-10">
    <img
      src={client.logo}
      alt={client.name}
      className="h-16 md:h-20 w-auto object-contain transition-all duration-500 hover:scale-110"
      loading="lazy"
    />
  </div>
);

const ClientsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
          <span className="text-accent">عملاؤنا</span>
        </h2>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          نفتخر بثقة عملائنا الكرام
        </p>
      </div>

      <div className="relative" dir="ltr">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="flex animate-marquee-rtl gap-0 w-max items-center">
          {[...clients, ...clients, ...clients].map((client, i) => (
            <ClientLogo key={i} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
