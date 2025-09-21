export interface BookingResponse {
  bookingId: number;
  orderNo: string;
  orderDateTime: string; // ISO string
  status: string;
  amount: number;
  event: {
    eventId: number;
    eventPoster:string;
    eventName: string;
  };
  show: {
    showId: number;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:mm:ss"
    venue: string;
    venueAddress: string;
  };
  tickets: Ticket[];
  bookingAmount: BookingAmount;
  qrCode: string; // Base64 string
}

export interface Ticket {
  ticketId: number;
  ticketNumber: string;
  category: string;
  seatCode: string;
  rowLabel: string;
  seatNumber: number;
  priceAtPurchase: number;
  status: string;
}

export interface BookingAmount {
  baseAmount: number;
  platformFee: number;
  taxAmount: number;
  totalAmount: number;
}
