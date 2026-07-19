import type { Metadata } from 'next';
import Header from '@/components/Header';
import CreateEventForm from '@/components/CreateEventForm';

export const metadata: Metadata = {
  title: 'יצירת הזמנה לאירוע | Maorly',
  description:
    'צרו הזמנה דיגיטלית לאירוע שלכם - מלאו את פרטי האירוע, האולם ורשימת המוזמנים ואנחנו נדאג לשאר.',
};

export default function CreateEventPage() {
  return (
    <main className="w-full" dir="rtl">
      <Header />
      <CreateEventForm />
    </main>
  );
}
