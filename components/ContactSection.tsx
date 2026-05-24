'use client';

import React, { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="py-24 px-4 bg-[#F4F5F7]" dir="rtl" id="contact">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0D1B4B] mb-4">
            מעוניינים? נדבר
          </h2>
          <p className="text-xl text-gray-600">
            השאירו פרטים ונחזור אליכם עם הצעת מחיר מותאמת אישית
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-10 shadow-2xl border-2 border-[#1A56DB]">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-right text-gray-800 font-bold mb-3">
                שם מלא
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent text-right font-medium"
                placeholder="הכנס את שמך"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-right text-gray-800 font-bold mb-3">
                מספר טלפון
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent text-right font-medium"
                placeholder="הכנס את מספר הטלפון שלך"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A56DB] hover:bg-[#1349c9] text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-xl"
            >
              {submitted ? 'תודה! קיבלנו את הפרטים שלך' : 'השאירו פרטים'}
            </button>
          </div>
        </form>

        {submitted && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg text-center">
            <p className="text-green-700 font-bold text-lg">
              הודעה נשלחה בהצלחה! אנחנו נחזור אליך בקרוב.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
