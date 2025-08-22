



// export function isThisWeekend(eventDate: Date) {
//   const today = new Date();
//   const day = today.getDay(); // 0 = Sun ... 6 = Sat

//   const saturday = new Date(today);
//   saturday.setDate(today.getDate() + (6 - day));
//   saturday.setHours(0, 0, 0, 0); // midnight

//   const sunday = new Date(today);
//   sunday.setDate(today.getDate() + (7 - day));
//   sunday.setHours(23, 59, 59, 999); // end of Sunday

//   const eventDay = new Date(eventDate);
//   eventDay.setHours(0, 0, 0, 0); // ignore time

//   return eventDay >= saturday && eventDay <= sunday;
// }

// // --------------------------------------------------


// export const matchDateFilter = (

//     eventDate: Date,
//     selectedDates: string[]

// ): boolean => {


//     const today = new Date();
//     const tomorrow = new Date();

//     tomorrow.setDate(today.getDate() + 1);

//     if (selectedDates.length === 0) return true;



//     return selectedDates.some((date) => {

//         if (date === "Today") {
//             return ( // CONDITIONAL CHECK IS THE DATE TODAY OR NOT IF THESE 3 MATCH RETURN TRUE OR FALSE
//                 eventDate.getDate() === today.getDate() &&
//                 eventDate.getMonth() === today.getMonth() &&
//                 eventDate.getFullYear() === today.getFullYear()
//             );
//         }

//         if (date === "Tomorrow") {
//             return ( // CONDITIONAL CHECK IS THE DATE TODAY OR NOT IF THSESE 3 MATCH RETURN TRUE OR FALSE
//                 eventDate.getDate() === tomorrow.getDate() &&
//                 eventDate.getMonth() === tomorrow.getMonth() &&
//                 eventDate.getFullYear() === tomorrow.getFullYear()
//             );
//         } 

//         if (date === "This Weekend") {
//             return isThisWeekend(eventDate);
//         }


//         return false; // ✅ unknown case me false return
//     });
// };


// export function matchDateFilter(showDate: Date, selectedDates: string[]) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);

//   const dayAfterTomorrow = new Date(today);
//   dayAfterTomorrow.setDate(today.getDate() + 2);

//   // Weekend calculation (Saturday aur Sunday nikal lenge)
//   const saturday = new Date(today);
//   saturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7)); // Next Saturday
//   saturday.setHours(0, 0, 0, 0);

//   const sunday = new Date(saturday);
//   sunday.setDate(saturday.getDate() + 1);

//   // ✅ check matches
//   if (selectedDates.includes("Today")) {
//     return showDate.toDateString() === today.toDateString();
//   }

//   if (selectedDates.includes("Tomorrow")) {
//     return showDate.toDateString() === tomorrow.toDateString();
//   }

//   if (selectedDates.includes("This Weekend")) {
//     return (
//       showDate.toDateString() === saturday.toDateString() ||
//       showDate.toDateString() === sunday.toDateString()
//     );
//   }

//   return true; // agar koi filter select nahi hai to sabhi dikhayega
// }


// utils/dateFilters.ts



// /**
//  * Check if a date matches the selected date filters
//  * @param date - The date to check (from show.showDateTime)
//  * @param selectedDates - Array of selected date filters from Redux
//  * @returns boolean - true if the date matches any of the selected filters
//  */


// export const matchDateFilter = (date: Date, selectedDates: string[]): boolean => {
//   // If no date filters are selected, show all events
//   if (selectedDates.length === 0) {
//     return true;
//   }

//   const today = new Date();
//   const tomorrow = new Date(today);
//   tomorrow.setDate(today.getDate() + 1);

//   // Normalize dates to compare only the date part (ignore time)
//   const normalizeDate = (d: Date) => {
//     return new Date(d.getFullYear(), d.getMonth(), d.getDate());
//   };

//   const normalizedDate = normalizeDate(date);
//   const normalizedToday = normalizeDate(today);
//   const normalizedTomorrow = normalizeDate(tomorrow);

//   return selectedDates.some((filter) => {
//     switch (filter.toLowerCase()) {
//       case 'today':
//         return normalizedDate.getTime() === normalizedToday.getTime();
      
//       case 'tomorrow':
//         return normalizedDate.getTime() === normalizedTomorrow.getTime();
      
//       case 'this weekend': {
//         // Get the current week's Saturday and Sunday
//         const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        
//         // Calculate days until Saturday (6) and Sunday (0)
//         const daysUntilSaturday = (6 - dayOfWeek) % 7;
//         let daysUntilSunday = (7 - dayOfWeek) % 7;
        
//         // If today is Sunday, daysUntilSunday should be 0
//         if (dayOfWeek === 0) {
//           daysUntilSunday = 0;
//         }
        
//         const thisSaturday = new Date(today);
//         thisSaturday.setDate(today.getDate() + daysUntilSaturday);
        
//         const thisSunday = new Date(today);
//         thisSunday.setDate(today.getDate() + daysUntilSunday);
        
//         const normalizedSaturday = normalizeDate(thisSaturday);
//         const normalizedSunday = normalizeDate(thisSunday);
        
//         return (
//           normalizedDate.getTime() === normalizedSaturday.getTime() ||
//           normalizedDate.getTime() === normalizedSunday.getTime()
//         );
//       }
      
//       default:
//         // For other date formats, you can extend this logic
//         return false;
//     }
//   });
// };

// /**
//  * Get display name for date filters
//  */
// export const getDateFilterDisplayName = (filter: string): string => {
//   switch (filter.toLowerCase()) {
//     case 'today':
//       return 'Today';
//     case 'tomorrow':
//       return 'Tomorrow';
//     case 'this weekend':
//       return 'This Weekend';
//     default:
//       return filter;
//   }
// };

// /**
//  * Get available date filter options
//  */
// export const getDateFilterOptions = (): string[] => {
//   return ['Today', 'Tomorrow', 'This Weekend'];
// };



export const matchDateFilter = (
  showDate: Date,
  selectedDates: string[],
  startDate: string | null,
  endDate: string | null
) => {
  // agar koi date filter nahi hai to saare events dikhaye
  if (selectedDates.length === 0 && !startDate && !endDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const saturday = new Date(today);
  saturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));

  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  let match = false;

  // Quick filters
  if (selectedDates.includes("Today") && showDate.toDateString() === today.toDateString()) {
    match = true;
  }

  if (selectedDates.includes("Tomorrow") && showDate.toDateString() === tomorrow.toDateString()) {
    match = true;
  }

  if (selectedDates.includes("This Weekend") &&
      (showDate.toDateString() === saturday.toDateString() ||
       showDate.toDateString() === sunday.toDateString())) {
    match = true;
  }

  // Custom range filter
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (showDate >= start && showDate <= end) {
      match = true;
    }
  }

  // agar koi quick filter ya range match nahi hua to false
  return match;
};
