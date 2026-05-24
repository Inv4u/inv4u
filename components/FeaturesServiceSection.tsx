import React from 'react';

interface Feature {
  text: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  features: Feature[];
}

const categories: ServiceCategory[] = [
  {
    id: 'invitation',
    title: 'חוויית ההזמנה',
    icon: '🎁',
    features: [
      { text: 'הזמנות מקטלוג עיצובים או עיצוב אישי' },
      { text: 'וידאו אישי בתוך ההזמנה' },
      { text: 'ניווט לאולם ישירות מההזמנה' },
      { text: 'הוספה אוטומטית ליומן Google' }
    ]
  },
  {
    id: 'confirmation',
    title: 'אישורי הגעה',
    icon: '✓',
    features: [
      { text: 'אישור הגעה בוואטסאפ או SMS' },
      { text: 'תזכורות אוטומטיות לפני האירוע' },
      { text: 'שיחות טלפון חכמות למי שלא ענה' },
      { text: 'דשבורד מרכזי למעקב בזמן אמת' }
    ]
  },
  {
    id: 'event-day',
    title: 'ביום האירוע',
    icon: '📱',
    features: [
      { text: 'QR קוד לכניסה וספירת אורחים' },
      { text: 'מעקב בין מי שאישר למי שהגיע בפועל' },
      { text: 'סידור הושבה לפי אישורי הגעה' }
    ]
  },
  {
    id: 'after-event',
    title: 'אחרי האירוע',
    icon: '📸',
    features: [
      { text: 'גלריית תמונות משותפת לאורחים' },
      { text: 'הודעת תודה אוטומטית' },
      { text: 'ייצוא רשימת אורחים לאקסל' },
      { text: 'סיכום סופי של נוכחות' }
    ]
  }
];

export default function FeaturesServiceSection() {
  return (
    <section className="py-24 px-4 bg-[#0D1B4B]" dir="rtl" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            מה כולל השירות
          </h2>
          <p className="text-xl text-gray-300">
            פתרון מלא לניהול אירועים מתחילת התהליך ועד סיום
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl p-8 hover:shadow-2xl transition duration-300 border-2 border-[#1A56DB]"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{category.icon}</span>
                <h3 className="text-2xl font-bold text-[#0D1B4B]">
                  {category.title}
                </h3>
              </div>

              <ul className="space-y-4">
                {category.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-800"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1A56DB] text-white flex items-center justify-center text-sm font-bold mt-0.5">
                      ✓
                    </span>
                    <span className="text-right font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
