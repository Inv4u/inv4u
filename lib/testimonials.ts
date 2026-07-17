export interface Testimonial {
  /** The quote, in the customer's own words. */
  quote: string;
  /** Who said it, e.g. "דנה ל'". */
  name: string;
  /** Event context, e.g. "חתונה, תל אביב". */
  event: string;
}

/**
 * Real customer testimonials — ONE place to edit.
 *
 * HOW TO ACTIVATE: add objects to this array. The testimonials section renders
 * automatically once it is non-empty, and stays hidden while empty.
 *
 * Do NOT add anything that isn't a real quote from a real customer.
 */
export const testimonials: Testimonial[] = [];
