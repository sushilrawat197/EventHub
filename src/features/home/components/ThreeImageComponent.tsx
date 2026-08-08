const base = import.meta.env.BASE_URL;

const cards = [
  {
    img: `${base}img11.jpg`,
    step: "01",
    title: "Event Dashboard",
    desc: "Manage everything from one place",
  },
  {
    img: `${base}img16.jpg`,
    step: "02",
    title: "Analytics Overview",
    desc: "Track event performance easily",
  },
  {
    img: `${base}img17.jpg`,
    step: "03",
    title: "Ticket Management",
    desc: "Simplify ticket sales and tracking",
  },
];

const ThreeImgComponent = () => {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <p
            className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-600/80 sm:text-[11px]"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            Built for organizers
          </p>
          <h2
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-outfit), 'Plus Jakarta Sans', sans-serif" }}
          >
            Sell Tickets with{" "}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 bg-clip-text text-transparent">
              Ease
            </span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            No more struggling with complex event ticketing systems. MyTag makes
            it simple to set up and manage your events — you host standout
            experiences, we handle the technology.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {cards.map((card) => (
            <article
              key={card.step}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_16px_40px_rgba(37,99,235,0.12)] sm:rounded-3xl"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                <span
                  className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md sm:left-5 sm:top-5"
                  style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                >
                  {card.step}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3
                    className="text-lg font-semibold tracking-tight text-white sm:text-xl"
                    style={{ fontFamily: "var(--font-outfit), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="mt-1 text-sm text-blue-100/90"
                    style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {card.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeImgComponent;
