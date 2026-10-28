import ProfileViewer from "@/components/ProfileViewer";

const ProfileSection = () => {
  return (
    <section id="profile" className="py-20 bg-primary">
      <div className="container">
        <div className="text-center mb-10">
          <span className="text-accent font-semibold text-sm tracking-wider">تعرف علينا أكثر</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mt-2">بروفايل الشركة</h2>
          <p className="text-primary-foreground/70 mt-4 max-w-2xl mx-auto">
            تصفح بروفايل الشركة كاملاً — اسحب أو استخدم الأسهم للتنقل بين الصفحات، أو حمّل النسخة الكاملة بصيغة PDF.
          </p>
        </div>
        <ProfileViewer />
      </div>
    </section>
  );
};

export default ProfileSection;
