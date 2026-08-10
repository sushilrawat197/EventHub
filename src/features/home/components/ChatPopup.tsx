import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatBubbleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-7 w-7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    {/* White speech bubble */}
    <path
      d="M4.5 4.5h15A2.5 2.5 0 0122 7v8a2.5 2.5 0 01-2.5 2.5H11l-4.2 3.15a.75.75 0 01-1.2-.6V17.5H4.5A2.5 2.5 0 012 15V7a2.5 2.5 0 012.5-2.5z"
      fill="white"
    />
    {/* Blue dots */}
    <circle cx="8.2" cy="11" r="1.35" fill="#1A73E8" />
    <circle cx="12" cy="11" r="1.35" fill="#1A73E8" />
    <circle cx="15.8" cy="11" r="1.35" fill="#1A73E8" />
  </svg>
);

const ChatPopup = () => {
  const [open, setOpen] = useState(false);

  const handleEmailClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = "mailto:mytagtankiso@gmail.com";

    // Fallback for systems without a configured mail app.
    setTimeout(() => {
      if (document.hasFocus()) {
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=mytagtankiso@gmail.com",
          "_blank",
          "noopener,noreferrer",
        );
      }
    }, 700);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      <div
        className={cn(
          "flex flex-col items-end gap-3 transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0",
        )}
        aria-hidden={!open}
      >
        <a
          href="https://wa.me/+26663820303"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] shadow-md transition hover:scale-105"
          aria-label="Chat on WhatsApp"
          title="WhatsApp"
          tabIndex={open ? 0 : -1}
        >
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.672.15s-.768.967-.941 1.166c-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.672-1.611-.921-2.21-.242-.579-.487-.5-.672-.51l-.572-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.412.248-.694.248-1.29.173-1.412-.074-.123-.272-.198-.57-.347z" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.04 2.002C6.54 1.89 2.003 6.273 2.002 11.769a9.707 9.707 0 001.372 5.029L2 22l5.315-1.367a9.738 9.738 0 004.725 1.206h.014c5.497 0 9.983-4.487 9.996-9.987.012-5.523-4.474-10.01-10.01-10.01zm-.01 17.987a8.01 8.01 0 01-4.072-1.117l-.292-.173-3.156.812.843-3.074-.19-.314a7.966 7.966 0 01-1.223-4.303c.001-4.426 3.602-8.027 8.03-8.027 2.144 0 4.157.836 5.67 2.35a7.957 7.957 0 012.352 5.674c-.013 4.428-3.615 8.022-8.052 8.022z"
            />
          </svg>
        </a>

        <a
          href="tel:+26663820303"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb] shadow-md transition hover:scale-105"
          aria-label="Call support"
          title="Call"
          tabIndex={open ? 0 : -1}
        >
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 6a1 1 0 011-1h3.49a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.24 1.01l-2.2 2.2z" />
          </svg>
        </a>

        <a
          href="mailto:mytagtankiso@gmail.com"
          onClick={handleEmailClick}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ea4335] shadow-md transition hover:scale-105"
          aria-label="Email support"
          title="Email"
          tabIndex={open ? 0 : -1}
        >
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-.4 2L12 11.25 4.4 6h15.2zM4 18V8.12l7.43 5.14a1 1 0 001.14 0L20 8.12V18H4z" />
          </svg>
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/50",
          open
            ? "bg-slate-800 text-white shadow-lg"
            : "animate-chat-fab-pulse bg-[#1A73E8] text-white",
        )}
        aria-expanded={open}
        aria-label={open ? "Close chat options" : "Open chat options"}
        title={open ? "Close" : "Chat"}
      >
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            open ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
          )}
        >
          <ChatBubbleIcon />
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            open ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0",
          )}
        >
          <X className="h-6 w-6" />
        </span>
      </button>
    </div>
  );
};

export default ChatPopup;
