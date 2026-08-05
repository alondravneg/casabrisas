export interface Improvement {
  id?: number;

  title: string;
  category: string;
  date: string;

  materialCost: number;
  laborCost: number;

  paidBy: string;

  notes: string;

  images?: string[];
}

export interface RentInfo {
  monthlyRent: number;
  startDate: string;
}

export interface RentMovement {
  id: number;
  month: string;
  amount: number;
  applied: boolean;
}