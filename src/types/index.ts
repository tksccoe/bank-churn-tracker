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
