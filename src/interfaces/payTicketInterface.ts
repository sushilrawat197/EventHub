export interface payTickeResponse {
  bookingId: number;
  status: string;
  bookingReference: string;
  bookingTime: string; // ISO datetime
  expiryTime: string;  // ISO datetime
  eventName: string;
  showDate: string;    // YYYY-MM-DD
  showTime: string;    // HH:mm:ss
  showVenue: string;
  language: string;
  fees: {
    baseAmount: number;
    platformFee: number;
    taxAmount: number;
    totalAmount: number;
  };
  tickets: {
    ticketId: number;
    categoryName: string;
    status: string;
    priceAtPurchase: number;
    currentPrice: number;
    rowLabel: string;
    seatNumber: number;
    seatCode: string;
  }[];
  
  payment:Payment
}

export interface Payment {
    paymentId: number;
    amount: number;
    paymentType: string;
    status: string;
    transactionRef: string;
    transactionId: string;
    conversationId: string;
    responseCode: string;
    responseDesc: string;
    phoneNumber: string;
    requestedAt: string;  // ISO datetime
    completedAt: string;  // ISO datetime
    refund:Refund
}

export interface Refund {
  refundAmount: number;
  refundStatus: string; // status fix list ho to union type
  conversationId: string;
  phoneNumber: string;
  processedAt: string; // ISO date string
}
