import { MessageCircle, PhoneCall, UserRound, type LucideIcon } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { AI_DEMO_AUDIO_SRC, aiDemoAudioExists } from '@/lib/media';

interface Stage {
  icon: LucideIcon;
  title: string;
  line: string;
}

const stages: Stage[] = [
  {
    icon: MessageCircle,
    title: 'ההזמנה נשלחת בוואטסאפ',
    line: 'כל המוזמנים מקבלים הזמנה אישית ומאשרים הגעה בלחיצה.',
  },
  {
    icon: PhoneCall,
    title: 'AI מתקשר למי שלא הגיב',
    line: 'שיחה בעברית טבעית שמאשרת הגעה — בלי שתרימו טלפון.',
  },
  {
    icon: UserRound,
    title: 'שיחות על ידי אדם למי שנשאר',
    line: 'מי שעדיין לא ענה מקבל שיחה אישית. שום מוזמן לא נשמט.',
  },
];

/**
 * The real RSVP flow, as a vertical timeline: WhatsApp → AI calls → human
 * calls. The AI voice demo player sits under stage 2, and only renders once the
 * recording exists (see lib/media). Server component — fs check is server-side.
 */
export default function RsvpFlowSection() {
  const hasAudio = aiDemoAudioExists();

  return (
    <section className="bg-white px-5 py-16 md:py-24" dir="rtl" id="how-it-works">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-xl">
          <h2 className="text-3xl font-extrabold leading-tight text-brand-navy md:text-4xl">
            אף מוזמן לא נשמט
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-500 md:text-lg">
            שלושה שלבים אוטומטיים אוספים את האישורים בשבילכם — עד האחרון.
          </p>
        </div>

        {/* vertical timeline — the spine runs down the center of the nodes (RTL) */}
        <ol className="relative mt-10 space-y-8">
          {/* connecting line, behind the nodes */}
          <span
            aria-hidden
            className="absolute top-3 bottom-3 right-[1.24rem] w-0.5 bg-gray-100"
          />

          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <li key={stage.title} className="relative flex items-start gap-4">
                <span className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy text-white">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>

                <div className="flex-1 pt-0.5">
                  <span className="text-sm font-bold text-brand-blue">שלב {i + 1}</span>
                  <h3 className="mt-0.5 text-lg font-bold text-brand-navy md:text-xl">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-base leading-relaxed text-gray-600">
                    {stage.line}
                  </p>

                  {/* AI voice demo attaches to stage 2 — only when the file exists */}
                  {i === 1 && hasAudio && (
                    <div className="mt-4 max-w-md">
                      <AudioPlayer src={AI_DEMO_AUDIO_SRC} label="האזינו לשיחת AI לדוגמה" />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
