import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, LayoutGrid, Maximize, Minimize, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import profilePdf from "@/assets/company-profile.pdf.asset.json";

const TOTAL_PAGES = 80;
const pageSrc = (n: number) => `/profile/page-${String(n).padStart(2, "0")}.jpg`;

const ProfileViewer = () => {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((n: number) => {
    setPage(Math.min(TOTAL_PAGES, Math.max(1, n)));
    setZoom(1);
  }, []);

  const next = useCallback(() => goTo(page + 1), [page, goTo]);
  const prev = useCallback(() => goTo(page - 1), [page, goTo]);

  // Preload adjacent pages
  useEffect(() => {
    [page + 1, page + 2, page - 1].forEach((n) => {
      if (n >= 1 && n <= TOTAL_PAGES) {
        const img = new Image();
        img.src = pageSrc(n);
      }
    });
  }, [page]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") next(); // RTL: left = next
      if (e.key === "ArrowRight") prev();
      if (e.key === "Escape") setGridOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next(); // swipe left = next (RTL)
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <div ref={containerRef} className="flex flex-col bg-primary rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="text-primary-foreground/70 text-sm font-medium">
          صفحة {page} من {TOTAL_PAGES}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGridOpen(true)}
            className="p-2 rounded-full text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10 transition-colors"
            aria-label="عرض جميع الصفحات"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
            disabled={zoom <= 1}
            className="p-2 rounded-full text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10 transition-colors disabled:opacity-30"
            aria-label="تصغير"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            disabled={zoom >= 3}
            className="p-2 rounded-full text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10 transition-colors disabled:opacity-30"
            aria-label="تكبير"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10 transition-colors"
            aria-label="ملء الشاشة"
          >
            {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
          <a
            href={profilePdf.url}
            download="بروفايل-اسس-السلامة-والعمارة.pdf"
            className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تحميل</span>
          </a>
        </div>
      </div>

      {/* Viewer */}
      <div
        className="relative flex items-center justify-center overflow-hidden select-none h-[60vh] md:h-[75vh]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Side arrows */}
        <button
          onClick={prev}
          disabled={page <= 1}
          className="absolute right-2 md:right-6 z-10 p-3 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-20 disabled:pointer-events-none"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          disabled={page >= TOTAL_PAGES}
          className="absolute left-2 md:left-6 z-10 p-3 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-20 disabled:pointer-events-none"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="h-full w-full flex items-center justify-center overflow-auto px-14 md:px-24">
          <img
            key={page}
            src={pageSrc(page)}
            alt={`صفحة ${page} من بروفايل الشركة`}
            draggable={false}
            className="max-h-full w-auto max-w-full rounded-lg shadow-2xl transition-transform duration-200 animate-in fade-in"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
      </div>

      {/* Footer controls */}
      <div className="px-4 md:px-6 py-4 flex flex-col items-center gap-3">
        <input
          type="range"
          min={1}
          max={TOTAL_PAGES}
          value={page}
          onChange={(e) => goTo(Number(e.target.value))}
          className="w-full max-w-md accent-[#E02020]"
          aria-label="التنقل بين الصفحات"
          dir="ltr"
        />
      </div>

      {/* Grid overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-primary/97 backdrop-blur-md overflow-y-auto transition-all duration-300",
          gridOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-primary-foreground text-xl font-bold">جميع الصفحات</h2>
            <button
              onClick={() => setGridOpen(false)}
              className="p-2 rounded-full text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => {
                  goTo(n);
                  setGridOpen(false);
                }}
                className={cn(
                  "relative rounded-md overflow-hidden border-2 transition-all hover:border-accent",
                  n === page ? "border-accent" : "border-transparent"
                )}
              >
                <img src={pageSrc(n)} alt={`صفحة ${n}`} loading="lazy" className="w-full h-auto" />
                <span className="absolute bottom-1 right-1 bg-primary/80 text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                  {n}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewer;
