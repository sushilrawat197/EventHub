import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export interface NavSection {
  id: string;
  label: string;
}

function spyOffset(bar: HTMLElement | null) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--site-header-height");
  const header = Number.parseFloat(raw);
  const barHeight = bar?.getBoundingClientRect().height ?? 56;
  return (Number.isFinite(header) ? header : 128) + barHeight + 16;
}

export default function PackageSectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);
  const lockUntil = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (Date.now() < lockUntil.current) return;
      let current = sections[0]?.id;
      for (const section of sections) {
        const node = document.getElementById(section.id);
        if (node && node.getBoundingClientRect().top - spyOffset(listRef.current) <= 0) current = section.id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = sections[sections.length - 1]?.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  useEffect(() => {
    const link = listRef.current?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    link?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  function jump(id: string) {
    setActive(id);
    lockUntil.current = Date.now() + 700;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const links = Array.from(listRef.current?.querySelectorAll<HTMLElement>("a") ?? []);
    const index = links.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    event.preventDefault();
    const next = links[(index + (event.key === "ArrowRight" ? 1 : -1) + links.length) % links.length];
    next.focus();
  }

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Package sections"
      className="sticky top-[calc(var(--site-header-height,8rem)+0.75rem)] z-30 -mx-4 border-b border-slate-200 bg-white/95 px-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)] backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-2 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none print:hidden"
    >
      <ul ref={listRef} onKeyDown={onKeyDown} className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                data-section={section.id}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  jump(section.id);
                }}
                className={`block whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold xl:px-3.5 xl:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
