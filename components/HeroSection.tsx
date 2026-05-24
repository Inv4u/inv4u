export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F5F7] via-gray-100 to-[#F4F5F7] px-4" dir="rtl">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-black leading-none">
            <span className="text-[#0D1B4B]">INV</span>
            <span className="text-[#1A56DB]">4</span>
            <span className="text-[#0D1B4B]">U</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B4B] leading-tight">
            הטכנולוגיה שמנהלת את האירוע שלך
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-medium">
            האוטומציה החכמה היחידה בישראל - והמשתלמת ביותר בשוק
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
          <button className="bg-[#1A56DB] hover:bg-[#1349c9] text-white font-bold py-4 px-10 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-xl">
            התחל בחינם
          </button>
          <button className="border-2 border-[#1A56DB] text-[#1A56DB] font-bold py-4 px-10 rounded-lg transition duration-200 text-lg hover:bg-[#1A56DB] hover:text-white">
            שמע עוד
          </button>
        </div>
      </div>
    </section>
  );
}
