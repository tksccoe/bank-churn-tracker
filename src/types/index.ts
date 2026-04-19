export interface Offer {
  id: string;
  title: string;
  slug: string;
  institutionName: string;
  accountType: string;
  bonusAmount: number;
  requirements: string;
  description: string;
  referralUrl: string;
  expirationDate?: string;
  imageUrl?: string;
  featured: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AccountStatus = 'Pending' | 'Completed' | 'Closed' | 'Declined';

export interface Account {
  id: string;
  institutionName: string;
  accountType?: string;
  apy?: number;
  appliedDate?: string;
  approvedDate?: string;
  closedDate?: string;
  bonusAmount?: number;
  bonusRequirements?: string;
  bonusAmountReceived?: number;
  feeFreeRequirement?: string;
  notes?: string;
  monthlyFeeFreeMet?: Record<string, boolean>;
  status: AccountStatus;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}
