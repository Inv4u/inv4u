import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import CookieConsent from "../components/CookieConsent";

export const metadata: Metadata = {
  title: "Maorly - הטכנולוגיה שמנהלת את האירוע שלך",
  description: "פתרון מלא לניהול אירועים - הזמנות דיגיטליות, אישורי הגעה אוטומטיים וניהול אורחים בוואטסאפ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        {/* Hebrew display/serif/sans families for the typographic invitations + gallery,
            plus Cormorant Garamond for Latin accents (numerals, ampersands). */}
        <link
          href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;700;800&family=Assistant:wght@300;400;600;700&family=Suez+One&family=Cormorant+Garamond:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Rubik, sans-serif' }}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
