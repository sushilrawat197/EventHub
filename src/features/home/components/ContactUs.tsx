import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const contactInfo = [
  {
    icon: FaEnvelope,
    title: "Email Us",
    details: "mytagtankiso@gmail.com",
    description: "We'll respond within 24 hours",
    href: "mailto:mytagtankiso@gmail.com",
  },
  {
    icon: FaPhone,
    title: "Call Us",
    details: "+266 63820303, +266 5787 5950",
    description: "Mon–Fri from 8AM to 6PM",
    href: "tel:+26663820303",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Visit Us",
    details: "Thetsane West, Maseru",
    description: "Come say hello at our office",
    href: "https://maps.google.com/?q=Thetsane+West,+Maseru",
  },
];

const ContactPage = () => {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p
            className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-600/80 sm:text-[11px]"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            We&apos;re here to help
          </p>
          <h2
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-outfit), 'Plus Jakarta Sans', sans-serif" }}
          >
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            Have a question or need help? Reach out and we&apos;ll get back to
            you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            const isExternal = info.href.startsWith("http");

            return (
              <a
                key={info.title}
                href={info.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_32px_rgba(37,99,235,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 sm:p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-sm transition group-hover:scale-105 sm:h-12 sm:w-12">
                  <Icon className="text-lg sm:text-xl" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className="text-base font-semibold text-slate-900 sm:text-lg"
                    style={{ fontFamily: "var(--font-outfit), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {info.title}
                  </h3>
                  <p
                    className="mt-1 break-words text-sm font-medium text-slate-800 sm:text-[15px]"
                    style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {info.details}
                  </p>
                  <p
                    className="mt-1 text-xs text-slate-500 sm:text-sm"
                    style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {info.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
