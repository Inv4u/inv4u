import React from 'react';

const features = [
  'הזמנות דיגיטליות יפות',
  'שליחה בוואטסאפ לכל המוזמנים',
  'אישורי הגעה אוטומטיים',
  'ניהול רשימת אורחים',
  'שיחות טלפון אוטומטיות למי שלא ענה',
  'בינה מלאכותית שמדברת בעברית טבעית',
  'תמלול כל השיחות לדשבורד'
];

export default function FeaturesListSection() {
  return (
    <section className="py-20 px-4 bg-white" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            מה כולל השירות
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-lg text-gray-800 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
