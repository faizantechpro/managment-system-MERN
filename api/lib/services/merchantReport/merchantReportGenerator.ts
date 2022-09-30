import { sortByValue } from '../../utils/utils';
import {
  merchantReportSchema,
  interchangeFee,
  merchantFees,
  acquirerFees,
  savingOppertunity,
  refunds,
  chargeBacks,
  netwrokFees,
  networkInerchangeFee,
  authorizationToApproval,
  codes,
} from './merchantReport';

export class MerchantReportGenerator {
  authorizationSearchByDeclined: any;
  authorizationSummary: any;
  authorizationSummaryByDeclined: any;
  chargebackSummary: any;
  fundingSearch: any;
  fundingSummary: any;
  fundingSummaryByNetwork: any;
  settlementSummary: any;
  chargebackSearch: any;

  constructor(
    authorizationSearchByDeclined: any,
    authorizationSummary: any,
    authorizationSummaryByDeclined: any,
    chargebackSummary: any,
    chargebackSearch: any,
    fundingSearch: any,
    fundingSummary: any,
    fundingSummaryByNetwork: any,
    settlementSummary: any
  ) {
    this.authorizationSearchByDeclined = authorizationSearchByDeclined;
    this.authorizationSummary = authorizationSummary;
    this.authorizationSummaryByDeclined = authorizationSummaryByDeclined;
    this.chargebackSummary = chargebackSummary;
    this.chargebackSearch = chargebackSearch;
    this.fundingSearch = fundingSearch;
    this.fundingSummary = fundingSummary;
    this.fundingSummaryByNetwork = fundingSummaryByNetwork;
    this.settlementSummary = settlementSummary;
  }

  async processFiserResponse() {
    const merchantReport: merchantReportSchema = {
      totalTransactions: Number(this.getTotalTransactions().toFixed(2)),
      totalDollarsProcessed: Number(this.getDollarProcessed().toFixed(2)),
      totalFees: Number(this.getTotalFee().toFixed(2)),
      averageTransactions: Number(this.getAverageTransactions().toFixed(2)),
      averageFees: Number(this.getAverageFees().toFixed(2)),
      savingOppertunity: this.getSavingOppertunity(),
      authorizationToApproval: this.getAuthorizationToApproval(),
      refund: this.getRefunds(),
      chargeBacks: this.getChargeBacks(),
      merchantFees: this.getMerchantFee(),
      netwrokFees: this.getNetworkFees(),
      OrganizationName: 'Sillicon villey bank',
      CustomerName: '',
      date: new Date('12/10/2021'),
    };

    return merchantReport;
  }

  getTotalFee() {
    console.log(
      'fundingSummary' + JSON.stringify(this.fundingSummary)
    );
    return (
      this.fundingSummary[0]?.processedICCharges +
      this.fundingSummary[0]?.processedServiceCharges +
      this.fundingSummary[0]?.processedFees
    );
  }

  getICFeePercent(): number {
    return (this.getProcessedICCharges() / this.getTotalFee()) * 100;
  }
  getServiceFeePercent(): number {
    return (this.getProcessedServiceCharges() / this.getTotalFee()) * 100;
  }

  getProcessedPercent(): number {
    return (this.getProcessedFees() / this.getTotalFee()) * 100;
  }

  getProcessedICCharges(): number {
    return this.fundingSummary[0]?.processedICCharges;
  }

  getProcessedServiceCharges() {
    return this.fundingSummary[0]?.processedServiceCharges;
  }

  getProcessedFees() {
    return  (this.fundingSummary[0]?.processedFees / this.getTotalFee()) * 100;
    
  }

  getTotalTransactions(): number {
    return this.settlementSummary[0]?.salesCount;
  }
  getDollarProcessed(): number {
    return this.settlementSummary[0]?.netAmount;
  }

  getAverageTransactions(): number {
    return this.getDollarProcessed() / this.getTotalTransactions();
  }

  getAverageFees(): number {
    return this.getTotalFee() / this.getTotalTransactions();
  }

  getApprovalPercent(): number {
    return (
      (this.getApprovedTransactions() / this.getTotalCountApproval()) * 100
    );
  }

  getRefundPercent(): number {
    return (this.getRefundTransactions() / this.getTotalTransactions()) * 100;
  }

  getChargeBackPercent(): number {
    return (
      (this.getChargeBackTransactions() / this.getTotalTransactions()) * 100
    );
  }

  getApprovedTransactions(): number {
    console.log(
      'authorizationSummary' + JSON.stringify(this.authorizationSummary)
    );
    return this.authorizationSummary[0]?.approvedCount;
  }

  getRefundTransactions(): number {
    return this.settlementSummary[0]?.refundCount;
  }

  getChargeBackTransactions(): number {
    return this.chargebackSummary[0]?.countTotal;
  }

  getRefundAmount(): number {
    return this.settlementSummary[0]?.refundAmount;
  }

  getChargeBackAmount(): number {
    return this.chargebackSummary[0]?.chargebackAmountTotal;
  }
  getTotalCountApproval(): number {
    return this.authorizationSummary[0]?.countTotal;
  }
  getApprovalAmount(): number {
    return this.authorizationSummary[0]?.amountTotal;
  }
  getLostRevenue(): number {
    return this.getDollarProcessed() - this.getApprovalAmount();
  }

  getTopThreeDeclinedCodes(): any {
    let data: [];
    let top3: any;

    try {
      data = this.authorizationSearchByDeclined;
      const declinedCodes = data.reduce(function (acc: any, declined: any) {
        if (!acc[declined.declineReason])
          // if current category not in acc object
          acc[declined.declineReason] = 1;
        // add it to acc with value 1
        // otherwise (it exists), so
        else acc[declined.declineReason]++; // increment it
        return acc;
      }, {});

      top3 = sortByValue(declinedCodes).slice(0, 3);
    } catch (err) {
      // report error
    }

    return top3;
  }

  getTopThreeChargeBackCodes(): any {
    let data: [];
    let top3: any;

    try {
      data = this.chargebackSearch;

      const declinedCodes = data.reduce(function (acc: any, declined: any) {
        if (!acc[declined.Reason])
          // if current category not in acc object
          acc[declined.Reason] = 1;
        // add it to acc with value 1
        // otherwise (it exists), so
        else acc[declined.Reason]++; // increment it
        return acc;
      }, {});

      top3 = sortByValue(declinedCodes).slice(0, 3);
    } catch (err) {
      // report error
    }

    return top3;
  }

  calculatePercentageByValue(
    total: number,
    jsonArrayToCheck: []
  ): Array<codes> {
    const codes: Array<codes> = [];
    console.log('jsonArrayToCheck'+ JSON.stringify(jsonArrayToCheck))
    jsonArrayToCheck?.forEach(function (genre: any) {
      codes.push({
        percent: (genre[0] / total) * 100,
        reason: genre[1],
      });
    });

    return codes;
  }

  getSavingOppertunity(): savingOppertunity {
    const savingOppertunity: savingOppertunity = {
      higherRateProcessed: 24,
      savingOppertunityPercent: 24,
      additionalFeeToPay: 2345,
    };

    return savingOppertunity;
  }

  getRefunds(): refunds {
    const codes: Array<codes> = [];
    console.log('refund' + JSON.stringify(this.settlementSummary));

    const refunds: refunds = {
      refundPercent: Number(this.getRefundPercent().toFixed(2)),
      refundCount: this.getRefundTransactions(),
      refundAmount: Number(this.getRefundAmount().toFixed(2)),
      topRefundCodes: codes,
    };
    return refunds;
  }

  getChargeBacks(): chargeBacks {
    const codes = this.calculatePercentageByValue(
      this.chargebackSearch.length,
      this.getTopThreeChargeBackCodes()
    );

    const chargeBacks: chargeBacks = {
      chargeBackPercent: Number(this.getChargeBackPercent().toFixed(2)),
      chargeBackCount: this.getChargeBackTransactions(),
      chargeBackAmount: this.getChargeBackAmount(),
      topChargeBackCodes: codes,
    };
    return chargeBacks;
  }

  getAuthorizationToApproval(): authorizationToApproval {
    const codes = this.calculatePercentageByValue(
      this.authorizationSearchByDeclined.length,
      this.getTopThreeDeclinedCodes()
    );

    const authorizationToApproval: authorizationToApproval = {
      approvalPercent: Number(this.getApprovalPercent().toFixed(2)),
      declinedTransactions: Number(
        (this.getTotalCountApproval() - this.getApprovedTransactions()).toFixed(
          2
        )
      ),
      lostRevnueFromDeclined: Number(this.getLostRevenue().toFixed(2)),
      topDeclinedCodes: codes,
    };

    return authorizationToApproval;
  }

  getMerchantFee(): merchantFees {
    const merchantFees: merchantFees = {
      percentNotConrolled: 23,
      interchangeFee: this.getInterchangeFees(),
      networkFees: this.getNetworkFees(),
      acquirerFees: this.getAcquirerFees(),
    };

    return merchantFees;
  }

  getAcquirerFees(): acquirerFees {
    const acquirerFees: acquirerFees = {
      percent: Math.abs( Number(this.getProcessedFees().toFixed(2))),
      type: 'Processor',
    };

    return acquirerFees;
  }

  getNetworkInterchangeFees(): Array<networkInerchangeFee> {
    const networkInerchangeFees: Array<networkInerchangeFee> = [];
    console.log("fundingSummaryByNetwork: "+ JSON.stringify(this.fundingSummaryByNetwork));

    this.fundingSummaryByNetwork?.forEach(function (fundingSummary: any) {
      networkInerchangeFees.push({
        IcFee: Number(Math.abs(fundingSummary.processedICCharges).toFixed(2)),
        IcRate: Number(
          (
            (Math.abs(fundingSummary.processedICCharges) /
              Math.abs(fundingSummary.processedAmountPaid)) *
            100
          ).toFixed(2)
        ),
        downgrades: 0,
        cardNetwork: fundingSummary?.value,
      });
    });
    return networkInerchangeFees;
  }

  getNetworkFees(): netwrokFees {
    const netwrokFees: netwrokFees = {
      networkFeePercent:  Number(this.getServiceFeePercent().toFixed(2)),
      assessmentFee: 0,
      accessFee: 0,
      networks: 'Visa, MasterCard, AMEX, Discover (Card Network)',
      networkInterchangeFee:  this.getNetworkInterchangeFees(),
    };
    return netwrokFees;
  }

  getInterchangeFees(): interchangeFee {
    const interchangeFee: interchangeFee = {
      percent:  Number(this.getICFeePercent().toFixed(2)),
      regularDebitPercent: 0,
      regularDebitPerTransactiont: 0,
      corporateCreditPercent: 0,
      corporateCreditPerTransaction: 0,
    };

    return interchangeFee;
  }
}
