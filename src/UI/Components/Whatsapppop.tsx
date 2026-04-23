const WhatsApppop = () => {
  const handleEmailClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = "mailto:mytagtankiso@gmail.com";

    // Fallback for systems without a configured mail app.
    setTimeout(() => {
      if (document.hasFocus()) {
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=mytagtankiso@gmail.com",
          "_blank",
          "noopener,noreferrer"
        );
      }
    }, 700);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      <a
        href="https://wa.me/+26663820303"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#25d366] rounded-full flex items-center justify-center shadow-md"
        aria-label="Chat on WhatsApp"
        title="WhatsApp"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
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
        className="w-12 h-12 bg-[#2563eb] rounded-full flex items-center justify-center shadow-md"
        aria-label="Call support"
        title="Call"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 6a1 1 0 011-1h3.49a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.24 1.01l-2.2 2.2z" />
        </svg>
      </a>

      <a
        href="mailto:mytagtankiso@gmail.com"
        onClick={handleEmailClick}
        className="w-12 h-12 bg-[#ea4335] rounded-full flex items-center justify-center shadow-md"
        aria-label="Email support"
        title="Email"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm-.4 2L12 11.25 4.4 6h15.2zM4 18V8.12l7.43 5.14a1 1 0 001.14 0L20 8.12V18H4z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsApppop;
