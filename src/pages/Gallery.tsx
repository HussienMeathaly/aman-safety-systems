import { useState, useEffect, useRef } from "react";
import { ArrowRight, X, ChevronLeft, ChevronRight, MapPin, Briefcase, Maximize2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Project {
  image: string;
  title: string;
  category: string;
  scope?: string;
  area?: string;
  location?: string;
}

const projects: Project[] = [
  {
    image: "/gallery/project-villa-modern.jpg",
    title: "تصميم فيلا خاصة بطراز مودرن",
    category: "سكني",
    scope: "تصميم معماري وإنشائي",
    area: "480م²",
    location: "الرياض - المهدية",
  },
  {
    image: "/gallery/project-duplex-villas.jpg",
    title: "تصميم فلل دوبلكس",
    category: "سكني",
    scope: "تصميم معماري وإنشائي",
    area: "810م²",
    location: "الرياض - ديراب",
  },
  {
    image: "/gallery/project-residential-villa.jpg",
    title: "تصميم فيلا سكنية",
    category: "سكني",
    scope: "تصميم معماري وإنشائي",
    area: "288م²",
    location: "الرياض - ديراب",
  },
  {
    image: "/gallery/project-penthouse-villas.jpg",
    title: "تصميم فلل بنت هاوس متلاصقة",
    category: "سكني",
    scope: "تصميم معماري وإنشائي",
    area: "1500م²",
    location: "الرياض - نمار",
  },
  {
    image: "/gallery/project-duplex-musaif.jpg",
    title: "تصميم فلل دبلكس",
    category: "سكني",
    scope: "تصميم معماري وإنشائي",
    area: "780م²",
    location: "الرياض - المصيف",
  },
  {
    image: "/gallery/project-duplex-laban.jpg",
    title: "تصميم فلل دبلكس",
    category: "سكني",
    scope: "تصميم معماري وإنشائي",
    area: "898م²",
    location: "الرياض - ضاحية لبن",
  },
  {
    image: "/gallery/project-commercial-sulaiman.jpg",
    title: "عمارة تجارية، شركة السليمان العقارية",
    category: "تجاري",
    scope: "تصميم معماري وإنشائي",
    area: "4750م²",
    location: "الرياض - خريص",
  },
  {
    image: "/gallery/project-sales-building.jpg",
    title: "تصميم مبنى مبيعات",
    category: "تجاري",
    scope: "تصميم معماري وإنشائي",
    area: "1927م²",
    location: "الرياض - الجنادية",
  },
  {
    image: "/gallery/project-mixed-namar.jpg",
    title: "تصميم عمارة تجارية سكنية",
    category: "تجاري - سكني",
    scope: "تصميم معماري وإنشائي",
    area: "1680م²",
    location: "الرياض - ضاحية نمار",
  },
  {
    image: "/gallery/project-warehouse-masani.jpg",
    title: "تصميم مبسط مواد بناء",
    category: "صناعي",
    scope: "تصميم معماري وإنشائي",
    area: "1333م²",
    location: "الرياض - حي المصانع",
  },
  {
    image: "/gallery/project-mixed-namar2.jpg",
    title: "تصميم عمارة تجارية سكنية",
    category: "تجاري - سكني",
    scope: "تصميم معماري وإنشائي",
    area: "1029م²",
    location: "الرياض - ضاحية نمار",
  },
  {
    image: "/gallery/project-gas-station.jpg",
    title: "تصميم محطة وقود",
    category: "تجاري",
    scope: "تصميم معماري وإنشائي",
    area: "1680م²",
    location: "الرياض - ضاحية نمار",
  },
  {
    image: "/gallery/project-maintenance-center.jpg",
    title: "تصميم مركز صيانة متخصص",
    category: "تجاري",
    scope: "تصميم معماري وإنشائي",
    area: "1275م²",
    location: "الرياض - حي الحزم",
  },
  {
    image: "/gallery/project-grid-villa4.jpg",
    title: "جريد فيلا 4",
    category: "سكني",
    scope: "تصميم معماري وإنشائي",
    area: "3000م²",
    location: "الرياض - النرجس",
  },
  {
    image: "/gallery/project-compound-malqa.jpg",
    title: "مجمع فلل (كمباوند) تفاصيل لايف",
    category: "سكني",
    scope: "تصميم معماري وإنشائي",
    area: "7911.12م²",
    location: "شمال الرياض - حي الملقا",
  },
];

const ProjectCard = ({ project, index, onImageClick }: { project: Project; index: number; onImageClick: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/30 transition-all duration-500 shadow-sm hover:shadow-xl group"
    >
      {/* Image */}
      <div className="relative overflow-hidden cursor-pointer" onClick={onImageClick}>
        <div
          className={`absolute inset-0 bg-muted/80 backdrop-blur-xl transition-opacity duration-700 z-[1] ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <div className="w-full h-full animate-pulse bg-gradient-to-br from-muted to-muted-foreground/10" />
        </div>
        <motion.img
          src={project.image}
          alt={project.title}
          className={`w-full h-56 md:h-64 object-cover transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute top-3 right-3 z-[2]">
          <span className="text-xs font-semibold bg-accent text-accent-foreground px-3 py-1 rounded-full shadow-md">
            {project.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 z-[1] flex items-center justify-center">
          <motion.div
            className="bg-accent/90 text-accent-foreground rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <Eye className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3 text-right">
        <h3 className="text-foreground font-bold text-base md:text-lg">{project.title}</h3>

        <div className="space-y-2">
          {project.scope && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Briefcase className="w-4 h-4 text-accent shrink-0" />
              <span>نطاق العمل: {project.scope}</span>
            </div>
          )}
          {project.area && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Maximize2 className="w-4 h-4 text-accent shrink-0" />
              <span>المساحة: {project.area}</span>
            </div>
          )}
          {project.location && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span>موقع المشروع: {project.location}</span>
            </div>
          )}
        </div>

        <button
          onClick={onImageClick}
          className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          تفاصيل المشروع
        </button>
      </div>
    </motion.div>
  );
};

const categories = ["الكل", ...Array.from(new Set(projects.map((p) => p.category)))];

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filteredProjects = activeCategory === "الكل"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const images = filteredProjects.map((p) => p.image);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goPrev = () =>
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  const goNext = () =>
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-16 md:pt-36 md:pb-24 section-dark">
        <div className="container">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px flex-1 max-w-[200px] bg-accent/60" />
              <h1 className="text-2xl md:text-4xl font-bold">تصفح احدث المشاريع</h1>
              <div className="h-px flex-1 max-w-[200px] bg-accent/60" />
            </div>
            <p className="text-primary-foreground/60 text-sm md:text-base mb-2">
              نماذج من مشاريعنا المنفذة في مختلف القطاعات
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-medium"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedIndex(null); }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-accent text-accent-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:border-accent/40 hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.title + i} project={project} index={i} onImageClick={() => openLightbox(i)} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
          >
            <motion.button
              onClick={closeLightbox}
              className="absolute top-4 left-4 text-white/80 hover:text-white z-10"
              whileHover={{ scale: 1.2, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-8 h-8" />
            </motion.button>

            <motion.button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
              whileHover={{ scale: 1.2, x: 4 }}
            >
              <ChevronRight className="w-10 h-10" />
            </motion.button>

            <motion.button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
              whileHover={{ scale: 1.2, x: -4 }}
            >
              <ChevronLeft className="w-10 h-10" />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex]}
                alt={projects[selectedIndex]?.title}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <motion.div
              className="absolute bottom-4 text-white/60 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {selectedIndex + 1} / {images.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
