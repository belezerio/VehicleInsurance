export interface User {
  userId: number;
  fullName: string;
  email: string;
  dateOfBirth: string;
  aadhaarNumber: string;
  panNumber: string;
  address: string;
  role: string;
  age: number;
}

export interface Policy {
  policyId: number;
  policyName: string;
  vehicleCategory: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  addOns: AddOn[];
}

export interface AddOn {
  addOnId: number;
  addOnName: string;
  addOnPrice: number;
}

export interface Proposal {
  proposalId: number;
  userId: number;
  userName: string;
  policyId: number;
  policyName: string;
  vehicleNumber: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleCategory: string;
  status: string;
  officerRemarks: string;
  submittedAt: string;
  selectedAddOns: AddOn[];
}

export interface Quote {
  quoteId: number;
  proposalId: number;
  premiumAmount: number;
  validUntil: string;
  generatedAt: string;
}

export interface Payment {
  paymentId: number;
  proposalId: number;
  amount: number;
  status: string;
  transactionRef: string;
  paymentDate: string;
}

export interface Claim {
  claimId: number;
  proposalId: number;
  userId: number;
  userName: string;
  claimDescription: string;
  claimAmount: number;
  status: string;
  officerRemarks: string;
  filedAt: string;
}

export interface Stats {
  activePolicies: number;
  claimsServed: number;
  totalCustomers: number;
}