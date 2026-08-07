export interface AvailableShow {
  showId: number;
  showDate: string;
  startTime: string;
  venueName: string;
  soldOut: boolean;
}

export interface EventAvailableShows {
  shows: AvailableShow[];
  eventId: number;
  eventSoldOut: boolean;
}
