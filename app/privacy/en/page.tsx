import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Maorly",
  description:
    "Maorly Privacy Policy: what information we collect, how we use it, the third-party services we rely on, and your rights.",
  alternates: {
    canonical: "https://inv4u.vercel.app/privacy/en",
    languages: {
      "he-IL": "https://inv4u.vercel.app/privacy",
      en: "https://inv4u.vercel.app/privacy/en",
    },
  },
};

const LAST_UPDATED = "June 28, 2026";

export default function PrivacyPageEn() {
  return (
    <main dir="ltr" lang="en" className="min-h-screen bg-white text-slate-700">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-brand-navy">
            <span dir="ltr">Maor<span className="text-brand-blue">ly</span></span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-slate-500 transition hover:text-brand-navy">
              Back to site
            </Link>
            <Link
              href="/privacy"
              className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
            >
              עברית
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14 text-left">
        {/* Header */}
        <div className="mb-10 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-extrabold text-brand-navy sm:text-4xl">
            Privacy <span className="text-brand-blue">Policy</span>
          </h1>
          <p className="mt-3 text-slate-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <article className="space-y-2">
          {/* 1. Introduction */}
          <Section title="1. Introduction — Who We Are">
            <P>
              Maorly (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;the
              Service&rdquo;) is a sole proprietorship (&ldquo;עוסק פטור&rdquo;)
              registered in Israel that provides a platform for creating smart
              digital event invitations, sending them to guests, collecting
              RSVPs, and making automated follow-up calls.
            </P>
            <P>
              The business owner and data controller is Maor Yosef Salem. This
              Privacy Policy explains what personal information we collect, how we
              use it, with whom we share it, and what rights you have regarding
              your information. It applies to our website at{" "}
              <A href="https://inv4u.vercel.app">https://inv4u.vercel.app</A> and
              to all services we offer through it.
            </P>
            <P>
              We operate in accordance with the Israeli Protection of Privacy
              Law, 5741-1981 and its regulations, as well as the principles of
              the EU General Data Protection Regulation (GDPR) for visitors from
              the European Union.
            </P>
          </Section>

          {/* 2. Information we collect */}
          <Section title="2. Information We Collect">
            <P>
              We distinguish between information we collect <strong>today</strong>{" "}
              and information we plan to collect as part of{" "}
              <strong>future services</strong> that have not yet launched.
            </P>

            <H3>Information we collect today</H3>
            <UL>
              <li>
                <strong>Contact details you submit voluntarily</strong> through
                the contact / lead form: full name, phone number, and email
                address, along with inquiry details (event type, estimated number
                of guests, date, and a free-text message).
              </li>
              <li>
                <strong>Basic technical information</strong> collected
                automatically on every visit, as is standard for any website: IP
                address, browser type, and operating system.
              </li>
              <li>
                <strong>Payment and billing records</strong> — the minimal
                details needed to issue receipts and reconcile payments you make
                by bank transfer, Bit, or cash (see &ldquo;Payments and
                Billing&rdquo;).
              </li>
            </UL>

            <H3>Account Information We Collect (at signup)</H3>
            <P>
              When you create an account, we collect and store the following to
              operate your account:
            </P>
            <UL>
              <li>
                <strong>Full name</strong> provided at signup.
              </li>
              <li>
                <strong>Email address</strong> and/or <strong>phone number</strong>{" "}
                used to sign in and to contact you about your event.
              </li>
              <li>
                <strong>Password</strong> — stored only in{" "}
                <strong>hashed (encrypted) form</strong> by Supabase Auth. We never
                see or store your password in plain text.
              </li>
              <li>
                <strong>Event details and guest list</strong> — once a package is
                arranged, when we or you enter the event details (type, date,
                venue) and the guest list (names and phone numbers). Guest details
                are processed on your behalf; you are responsible for obtaining your
                guests&rsquo; consent to be contacted.
              </li>
            </UL>

            <FutureBox>
              <h3 className="mb-3 text-lg font-bold text-brand-blue">
                Future Services — not yet collected
              </h3>
              <p className="mb-3 text-sm text-slate-500">
                The items below describe data collection planned for upcoming
                phases of the Service. This collection is{" "}
                <strong>not active today</strong>, and this policy will be
                updated when each capability actually launches.
              </p>
              <UL>
                <li>
                  <strong>Event details and guest lists</strong> — when the event
                  creation module launches: guest names and the event details
                  entered by the event organizer.
                </li>
                <li>
                  <strong>Guest contact information</strong> for sending
                  invitations, subject to the event organizer&rsquo;s consent and
                  their responsibility for obtaining consent from their guests.
                </li>
                <li>
                  <strong>WhatsApp messages sent to event guests</strong> via the
                  WhatsApp Business API.
                </li>
                <li>
                  <strong>Voice call recordings and transcripts</strong> from
                  automated, AI-powered follow-up calls to guests who have not
                  responded.
                </li>
                <li>
                  <strong>Online credit card payments via Stripe</strong> (see
                  &ldquo;Payments and Billing&rdquo;). Card data will be handled
                  by Stripe; we will never store card numbers on our servers.
                </li>
              </UL>
            </FutureBox>
          </Section>

          {/* 3. How we use the information */}
          <Section title="3. How We Use the Information">
            <UL>
              <li>
                To respond to and follow up on inquiries you submit via the form.
              </li>
              <li>
                <strong>To create and manage your account</strong>, authenticate
                your sign-in, and contact you about your event and the package that
                fits it.
              </li>
              <li>
                To provide, operate, and improve the Service, and to tailor
                quotes to your needs.
              </li>
              <li>
                To send operational notifications to the business owner about new
                inquiries (via email and WhatsApp).
              </li>
              <li>
                To issue receipts, reconcile payments, and meet accounting and
                tax obligations.
              </li>
              <li>
                To secure the website, prevent misuse, and maintain service
                integrity.
              </li>
              <li>To comply with applicable legal and regulatory obligations.</li>
              <li>
                In future services: to send invitations to guests, collect RSVPs,
                make follow-up calls, and process online payments — subject to the
                relevant consents.
              </li>
            </UL>
          </Section>

          {/* 4. Third-party services */}
          <Section title="4. Third-Party Services We Use">
            <P>
              We rely on external service providers to operate the Service. These
              providers process information on our behalf and in accordance with
              their own privacy policies:
            </P>
            <H3>In use today</H3>
            <UL>
              <li>
                <strong>Supabase</strong> — data storage in a PostgreSQL database
                and authentication (account management and password hashing)
                (servers in the EU / US).
              </li>
              <li>
                <strong>Vercel</strong> — website hosting and delivery
                infrastructure.
              </li>
              <li>
                <strong>Gmail / Google (SMTP)</strong> — sending email
                notifications.
              </li>
              <li>
                <strong>Twilio</strong> — sending WhatsApp notifications to the
                business owner.
              </li>
            </UL>
            <H3 className="text-brand-blue">Planned for future services</H3>
            <UL>
              <li>
                <strong>Stripe</strong> — online credit card payment processing
                (card details are handled solely by Stripe and are not stored by
                us).
              </li>
              <li>
                <strong>ElevenLabs</strong> — voice generation for automated
                follow-up calls.
              </li>
              <li>
                <strong>OpenAI Whisper</strong> — transcription of voice calls.
              </li>
              <li>
                <strong>Anthropic Claude</strong> — language processing and the
                logic powering smart conversations.
              </li>
            </UL>
          </Section>

          {/* 5. Payments and billing */}
          <Section title="5. Payments and Billing">
            <P>
              We offer several payment methods. For each one, we collect only the
              minimal information needed to issue receipts, reconcile payments,
              and meet our accounting and tax obligations.
            </P>
            <H3>Payment methods accepted today</H3>
            <UL>
              <li>
                <strong>Bank transfer</strong> — we receive the bank details
                needed to identify and reconcile your payment. We do not store
                sensitive banking information beyond what is required for
                reconciliation.
              </li>
              <li>
                <strong>Bit</strong> — payments are handled through the Bit app.
                We receive confirmation of payment but do not store your payment
                credentials.
              </li>
              <li>
                <strong>Cash</strong> — no digital payment data is collected. We
                keep only receipt records for accounting purposes.
              </li>
            </UL>
            <P>
              <strong>Record keeping:</strong> we retain billing and receipt
              records for the period required by Israeli tax law — currently seven
              (7) years for a sole proprietor (&ldquo;עוסק פטור&rdquo;).
            </P>
            <FutureBox>
              <h3 className="mb-3 text-lg font-bold text-brand-blue">
                Future service — online payment
              </h3>
              <UL>
                <li>
                  <strong>Stripe</strong> — for online credit card payments via
                  the website. We will never store card numbers; all card data
                  will be handled by Stripe&rsquo;s PCI-compliant infrastructure.
                  Online card payments are <strong>not yet available</strong>.
                </li>
              </UL>
            </FutureBox>
          </Section>

          {/* 6. Data retention */}
          <Section title="6. Data Retention">
            <P>
              We retain personal information for as long as it is necessary for
              the purposes for which it was collected — including providing the
              Service, responding to inquiries, and meeting legal and accounting
              obligations. Billing and receipt records are kept for the period
              required by Israeli tax law (currently seven (7) years for a sole
              proprietor / &ldquo;עוסק פטור&rdquo;). Inactive inquiry data will be
              deleted or anonymized after a reasonable period, unless we are
              legally required to retain it for longer. You may request deletion
              of your information at any time (see &ldquo;Your Rights&rdquo;).
            </P>
          </Section>

          {/* 7. Data security */}
          <Section title="7. Data Security">
            <P>
              We take reasonable technical and organizational measures to protect
              information against unauthorized access, use, or disclosure,
              including encryption in transit (HTTPS), access controls, and
              reliance on secure infrastructure providers. However, no method of
              transmission or storage is 100% secure, and we cannot guarantee
              absolute security.
            </P>
          </Section>

          {/* 8. Your rights */}
          <Section title="8. Your Rights">
            <P>
              Under the Israeli Protection of Privacy Law and the GDPR (where
              applicable to you), you have the following rights regarding your
              personal information:
            </P>
            <UL>
              <li>The right to access the information we hold about you.</li>
              <li>
                The right to request correction of inaccurate or outdated
                information.
              </li>
              <li>
                The right to request deletion of your information (the
                &ldquo;right to be forgotten&rdquo;).
              </li>
              <li>The right to object to or restrict certain processing.</li>
              <li>
                The right to withdraw consent you have given, without affecting
                the lawfulness of processing carried out beforehand.
              </li>
              <li>
                The right to lodge a complaint with the Israeli Privacy
                Protection Authority.
              </li>
            </UL>
            <P>
              To exercise your rights, contact us at the email address listed in
              the &ldquo;Contact Us&rdquo; section. We will handle your request
              within a reasonable time and in accordance with the law.
            </P>
          </Section>

          {/* 9. International transfers */}
          <Section title="9. International Data Transfers">
            <P>
              Some of our service providers store or process information outside
              of Israel, including in the European Union and the United States.
              When transferring information to these countries, we rely on
              accepted legal mechanisms for protecting the data and choose
              providers that are committed to recognized standards of data
              security and privacy.
            </P>
          </Section>

          {/* 10. Cookies */}
          <Section title="10. Cookies and Tracking Technologies">
            <P>
              The website may use essential cookies and basic technical data
              required for its proper operation. We do not currently use
              third-party advertising or marketing tracking cookies. You can
              block cookies through your browser settings, though doing so may
              impair some of the website&rsquo;s functions.
            </P>
          </Section>

          {/* 11. Children */}
          <Section title="11. Children's Privacy">
            <P>
              The Service is not intended for minors under the age of 18, and we
              do not knowingly collect personal information from children. If you
              become aware that a minor has provided us with information without
              the consent of a parent or guardian, please contact us and we will
              act to delete it.
            </P>
          </Section>

          {/* 12. Changes */}
          <Section title="12. Changes to This Policy">
            <P>
              We may update this Privacy Policy from time to time, particularly as
              new services launch. An updated version will be posted on this page
              alongside a new update date. We encourage you to review this page
              periodically. Continued use of the Service after an update
              constitutes acceptance of the updated policy.
            </P>
          </Section>

          {/* 13. Contact */}
          <Section title="13. Contact Us">
            <P>
              For any question, request, or matter related to privacy, you can
              reach us:
            </P>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
              <p className="mb-1">
                <strong>Business name:</strong> Maorly (sole proprietor /
                &ldquo;עוסק פטור,&rdquo; registered in Israel)
              </p>
              <p className="mb-1">
                <strong>Owner:</strong> Maor Yosef Salem
              </p>
              <p className="mb-1">
                <strong>Address:</strong> Shalom Shabazi 10, Petah Tikva, Israel
              </p>
              <p className="mb-1">
                <strong>Email:</strong>{" "}
                <A href="mailto:inv4u.business@gmail.com">
                  inv4u.business@gmail.com
                </A>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <A href="https://inv4u.vercel.app">https://inv4u.vercel.app</A>
              </p>
            </div>
          </Section>
        </article>

        {/* Footer toggle */}
        <div className="mt-14 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          מדיניות זו זמינה גם ב<A href="/privacy">עברית</A>.
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-6">
      <h2 className="mb-3 text-xl font-bold text-brand-navy">{title}</h2>
      {children}
    </section>
  );
}

function H3({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`mt-6 mb-3 text-lg font-bold text-brand-navy ${className}`}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-slate-600">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-4 list-disc space-y-2 pl-6 leading-relaxed text-slate-600 marker:text-brand-blue">
      {children}
    </ul>
  );
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-brand-blue underline-offset-4 hover:underline"
    >
      {children}
    </a>
  );
}

function FutureBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-brand-blue/20 bg-slate-50 p-6">
      {children}
    </div>
  );
}
