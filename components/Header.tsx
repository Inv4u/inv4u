export default function Header() {
  return (
    <header className="bg-[#F4F5F7] border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-[#0D1B4B]">
            INV<span className="text-[#1A56DB]">4</span>U
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-[#1A56DB] transition">
            המשיכויות
          </a>
          <a href="#contact" className="hover:text-[#1A56DB] transition">
            צור קשר
          </a>
        </nav>
      </div>
    </header>
  );
}
