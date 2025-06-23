export interface Review {
  flight: {
    flightNumber: string;
    airline: string;
    date: string; 
  };
  rating: number;
  comment: string;
  submittedAt: String;
}
