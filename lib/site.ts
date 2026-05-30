// Central place for contact details used across the site.
export const site = {
  email: 'inv4u.business@gmail.com',
  // Readable Israeli format shown to users.
  phoneDisplay: '050-644-5570',
  // International E.164 format (no +, no spaces) for tel: and wa.me links.
  phoneE164: '972506445570',
  whatsappDefaultText: 'היי! אשמח לשמוע עוד על INV4U לאירוע שלי 🎉',
} as const;

export const telHref = `tel:+${site.phoneE164}`;
export const mailHref = `mailto:${site.email}`;
export const whatsappHref = `https://wa.me/${site.phoneE164}?text=${encodeURIComponent(
  site.whatsappDefaultText
)}`;
