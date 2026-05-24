import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '📧',
    title: 'הזמנות דיגיטליות',
    description: 'צור הזמנות יפות וקלות לשליחה בכמה קליקים בלבד'
  },
  {
    icon: '💬',
    title: 'שליחה בוואטסאפ',
    description: 'שלח הזמנות ישירות דרך וואטסאפ לכל המוזמנים שלך'
  },
  {
    icon: '🤖',
    title: 'שיחות קול בבינה מלאכותית',
    description: 'אישורי הגעה אוטומטיים דרך שיחות טלפון חכמות'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            המשיכויות שלנו
          </h2>
          <p className="text-xl text-gray-600">
            הכל שתצטרכ לארגן אירועים מהנים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition duration-200 border border-gray-100"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
