import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MARATHON_FITNESS_WARRANTY_MODAL,
  MARATHON_FITNESS_WARRANTY_CHECKBOX_TEXT,
  MARATHON_TERMS_ACCEPTANCE_LABEL,
  MARATHON_TERMS_SECTION_TITLE,
  MARATHON_TERMS_VIEW_LABEL,
  type MarathonPolicyModalContent,
} from "@/constants/marathonRegistrationPolicy";

const policyLinkClass =
  "font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-sm";

function PolicyModal({
  content,
  onClose,
}: {
  content: MarathonPolicyModalContent | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!content) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [content, onClose]);

  if (!content) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="marathon-policy-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
          <h3 id="marathon-policy-modal-title" className="text-lg font-bold text-gray-900">
            {content.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="space-y-6">
            {content.sections.map((section, sectionIndex) => (
              <div key={`section-${sectionIndex}`}>
                {section.heading && (
                  <h4 className="mb-3 text-base font-bold text-gray-900">{section.heading}</h4>
                )}
                <ol className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={`section-${sectionIndex}-item-${itemIndex}`}
                      className="text-sm leading-relaxed text-gray-700"
                    >
                      {item.title ? (
                        <>
                          <span className="font-semibold text-gray-900">{item.title}. </span>
                          {item.body}
                        </>
                      ) : (
                        item.body
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 sm:px-6">
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MarathonRegistrationTermsSectionProps {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export default function MarathonRegistrationTermsSection({
  accepted,
  onAcceptedChange,
  error,
  disabled = false,
}: MarathonRegistrationTermsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "rounded-lg border bg-slate-50/80 p-3",
          error ? "border-red-200" : "border-gray-200"
        )}
      >
        <div className="flex items-start gap-2">
          <input
            id="marathon-fitness-warranty-accepted"
            type="checkbox"
            checked={accepted}
            disabled={disabled}
            onChange={(event) => onAcceptedChange(event.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => setModalOpen(true)}
            className={cn(
              "min-w-0 flex-1 text-left text-xs leading-relaxed text-gray-700",
              disabled ? "cursor-default opacity-90" : "cursor-pointer hover:text-gray-900"
            )}
          >
            <span className="font-semibold text-gray-800">{MARATHON_TERMS_SECTION_TITLE}:</span>{" "}
            {MARATHON_FITNESS_WARRANTY_CHECKBOX_TEXT}{" "}
            <span className={policyLinkClass}>{MARATHON_TERMS_VIEW_LABEL}</span>
          </button>
        </div>

        {error && <p className="mt-2 ml-5 text-[10px] text-red-600">{error}</p>}
      </div>

      <PolicyModal
        content={modalOpen ? MARATHON_FITNESS_WARRANTY_MODAL : null}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export { MARATHON_TERMS_ACCEPTANCE_LABEL };
