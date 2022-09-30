export type savingOppertunity = {
  higherRateProcessed?: number;
  savingOppertunityPercent?: number;
  additionalFeeToPay?: number;
};

export type authorizationToApproval = {
  approvalPercent?: number;
  lostRevenue?: number;
  declinedTransactions?: number;
  lostRevnueFromDeclined?: number;
  topDeclinedCodes: Array<codes>;
};

export type refunds = {
  refundPercent?: number;
  refundCount?: number;
  refundAmount?: number;
  topRefundCodes?: Array<codes>;
};

export type chargeBacks = {
  chargeBackPercent?: number;
  chargeBackCount?: number;
  chargeBackAmount?: number;
  topChargeBackCodes?: Array<codes>;
};

export type merchantFees = {
  percentNotConrolled?: number;
  interchangeFee?: interchangeFee;
  networkFees?: netwrokFees;
  acquirerFees?: acquirerFees;
};

export type interchangeFeeSummary = {
  percentNotConrolled?: number;
  interchantFee?: interchangeFee;
  networkFees?: netwrokFees;
  acquirerFees?: acquirerFees;
};

export type interchangeFee = {
  percent?: number;
  regularDebitPercent?: number;
  regularDebitPerTransactiont?: number;
  corporateCreditPercent?: number;
  corporateCreditPerTransaction?: number;
};

export type netwrokFees = {
  networkFeePercent?: number;
  assessmentFee?: number;
  accessFee?: number;
  networks?: string;
  networkInterchangeFee?: Array<networkInerchangeFee>;
};

export type networkInerchangeFee = {
  IcFee?: number;
  IcRate?: number;
  downgrades?: number;
  cardNetwork?: string;
};

export type acquirerFees = {
  percent?: number;
  type?: string;
};

export type codes = {
  percent?: number;
  reason?: string;
};
export type merchantReportSchema = {
  totalTransactions?: number;
  totalDollarsProcessed?: number;
  totalFees?: number;
  averageTransactions?: number;
  averageFees?: number;
  savingOppertunity?: savingOppertunity;
  authorizationToApproval?: authorizationToApproval;
  refund?: refunds;
  chargeBacks?: chargeBacks;
  merchantFees?: merchantFees;
  netwrokFees?: netwrokFees;
  OrganizationName?: string;
  CustomerName?: string;
  date?: Date;
};
