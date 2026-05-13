import { DayPicker } from "react-day-picker"
import type { DayPickerProps } from "react-day-picker"

import { cn } from "@/lib/utils"

import "react-day-picker/style.css"

export type CalendarProps = DayPickerProps

/**
 * shadcn-style calendar: pass layout + selection props on `<Calendar />`,
 * e.g. `mode="single"`, `selected`, `onSelect`, `className="rounded-lg border"`, `captionLayout="dropdown"`.
 */
function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn(
        "bg-white p-2 text-sm [--rdp-accent-color:#2563eb] [--rdp-accent-background-color:#eff6ff]",
        "[--rdp-day-height:32px] [--rdp-day-width:32px]",
        "[--rdp-day_button-height:30px] [--rdp-day_button-width:30px]",
        "[--rdp-nav_button-height:1.75rem] [--rdp-nav_button-width:1.75rem] [--rdp-nav-height:2.25rem]",
        "[--rdp-dropdown-gap:0.35rem]",
        className
      )}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
