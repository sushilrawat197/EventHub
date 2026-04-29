export interface BookingData {
  bookingId: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  bookingReference: string;
  bookingTime: string;   // ISO date string
  expiryTime: string;    // ISO date string
  eventName: string;
  showDate: string;      // YYYY-MM-DD
  showTime: string;      // HH:mm:ss
  showVenue: string;
  fees: Fees;
  tickets: Ticket[];
}

export interface Fees {
  baseAmount: number;
  platformFee: number;
  taxAmount: number;
  totalAmount: number;
}

export interface Ticket {
  ticketId: number;
  categoryName: string;
  status: "RESERVED" | "AVAILABLE" | "SOLD" | string;
  priceAtPurchase: number;
  currentPrice: number;
  rowLabel: string;
  seatNumber: number;
  seatCode: string;
}
