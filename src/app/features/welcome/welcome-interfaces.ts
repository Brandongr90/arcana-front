export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
}

export interface Testimonial {
  name: string;
  text: string;
  stars: number;
  specialty: string;
}

export interface TrustIndicators {
  members: string;
  rating: string;
}

export interface PricingInfo {
  amount: string;
  period: string;
  trial: string;
  cancellation: string;
}

export interface WelcomeData {
  title: string;
  description: string;
}

export interface FinalCTA {
  description: string;
  buttonText: string;
  disclaimer: string;
}