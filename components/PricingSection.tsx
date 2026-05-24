import React from 'react';

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'חינם',
    price: '0',
    features: [
      'עד 5 הזמנות לחודש',
      'הזמנות בסיסיות',
      'שליחה דרך קישור'
    ]
  },
  {
    name: 'Pro',
    price: '₪99',
    period: 'לחודש',
    features: [
      'הזמנות ללא הגבלה',
      'שליחה דרך וואטסאפ',
      'אישורי הגעה אוטומטיים',
      'עיצובים מעוצבים',
      'תמיכה דרך מייל'
    ],
    highlighted: true
  },
  {
    name: 'ביזנס',
    price: '₪299',
    period: 'לחודש',
    features: [
      'הכל ב-Pro',
      'שיחות קול בבינה מלאכותית',
      'ניתוח מתקדם',
      'אינטגרציה עם API',
      'תמיכה עדיפות'
    ]
  }
];

export default function PricingSection() {
  return (
    <section className="py-20 px-4 bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            תוכניות תמחור פשוטות
          </h2>
          <p className="text-xl text-gray-600">
            בחר את התוכנית שמתאימה לך ביותר
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 transition duration-200 ${
                plan.highlighted
                  ? 'bg-blue-600 text-white shadow-2xl scale-105'
                  : 'bg-white border border-gray-200 hover:shadow-lg'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-lg ml-2 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold mb-8 transition duration-200 ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                בחר תוכנית
              </button>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className={`flex items-start gap-3 ${plan.highlighted ? 'text-blue-100' : 'text-gray-700'}`}
                  >
                    <span className={`text-xl mt-1 ${plan.highlighted ? 'text-white' : 'text-blue-600'}`}>
                      ✓
                    </span>
                    <span className="text-right">{feature}</span>
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
