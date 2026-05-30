'use client';

import React, { useState } from 'react';

const EVENT_TYPES = [
  'חתונה',
  'בר מצווה',
  'בת מצווה',
  'ברית',
  'אירוע עסקי',
  'יום הולדת',
];

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    eventType: '',
    hostName: '',
    eventDate: '',
    eventTime: '',
    venueName: '',
    venueAddress: '',
  });
  const [guestListFile, setGuestListFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !file.name.toLowerCase().endsWith('.csv')) {
      setFileError('יש להעלות קובץ בפורמט CSV בלבד');
      setGuestListFile(null);
      return;
    }
    setFileError('');
    setGuestListFile(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle event creation here (send to API / CRM)
    console.log('Event created:', formData, guestListFile?.name);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        eventType: '',
        hostName: '',
        eventDate: '',
        eventTime: '',
        venueName: '',
        venueAddress: '',
      });
      setGuestListFile(null);
      setSubmitted(false);
    }, 4000);
  };

  const inputClass =
    'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent text-right font-medium';
  const labelClass = 'block text-right text-gray-800 font-bold mb-3';

  return (
    <section className="py-16 px-4 bg-[#F4F5F7]" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0D1B4B] mb-4">
            יצירת הזמנה לאירוע
          </h1>
          <p className="text-xl text-gray-600">
            מלאו את פרטי האירוע ואנחנו נבנה עבורכם הזמנה דיגיטלית מושלמת
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl border-2 border-[#1A56DB]"
        >
          <div className="space-y-6">
            {/* Event type */}
            <div>
              <label htmlFor="eventType" className={labelClass}>
                סוג האירוע
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className={`${inputClass} bg-white cursor-pointer`}
              >
                <option value="" disabled>
                  בחרו סוג אירוע
                </option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Host / couple name */}
            <div>
              <label htmlFor="hostName" className={labelClass}>
                שם הזוג / בעל האירוע
              </label>
              <input
                type="text"
                id="hostName"
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="לדוגמה: דנה ויוסי"
              />
            </div>

            {/* Date + time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="eventDate" className={labelClass}>
                  תאריך האירוע
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="eventTime" className={labelClass}>
                  שעת האירוע
                </label>
                <input
                  type="time"
                  id="eventTime"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Venue name */}
            <div>
              <label htmlFor="venueName" className={labelClass}>
                שם האולם / המקום
              </label>
              <input
                type="text"
                id="venueName"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="לדוגמה: אולמי הגן הקסום"
              />
            </div>

            {/* Venue address */}
            <div>
              <label htmlFor="venueAddress" className={labelClass}>
                כתובת האולם
              </label>
              <input
                type="text"
                id="venueAddress"
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="רחוב, מספר ועיר"
              />
            </div>

            {/* Guest list CSV upload */}
            <div>
              <label htmlFor="guestList" className={labelClass}>
                רשימת מוזמנים (קובץ CSV)
              </label>
              <label
                htmlFor="guestList"
                className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#1A56DB] hover:bg-blue-50 transition"
              >
                <svg
                  className="w-10 h-10 text-[#1A56DB] mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5 7.5 12M12 7.5v12"
                  />
                </svg>
                <span className="text-gray-800 font-bold text-center">
                  {guestListFile ? guestListFile.name : 'לחצו להעלאת קובץ CSV'}
                </span>
                <span className="text-gray-500 text-sm mt-1 text-center">
                  פורמט נתמך: CSV (שם, טלפון)
                </span>
                <input
                  type="file"
                  id="guestList"
                  name="guestList"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {fileError && (
                <p className="mt-2 text-red-600 font-medium text-right">
                  {fileError}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#1A56DB] hover:bg-[#1349c9] text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-xl"
            >
              {submitted ? 'ההזמנה נוצרה בהצלחה!' : 'צור הזמנה'}
            </button>
          </div>
        </form>

        {submitted && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg text-center">
            <p className="text-green-700 font-bold text-lg">
              ההזמנה נוצרה! אנחנו מכינים עבורכם את ההזמנה הדיגיטלית.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
