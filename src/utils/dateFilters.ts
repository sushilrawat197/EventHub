

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
