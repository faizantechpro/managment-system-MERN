import { FiserVService } from './fiservService';
import { MerchantReportGenerator } from './merchantReportGenerator';
export class MerchantReportService {
  protected getContextQuery() {
    return {};
  }
  async getMerchantReport(
    site_id: string,
    fromdate: string,
    todate: string
  ): Promise<any> {
    const fiservService = new FiserVService();

    // As data is sandbox, against one site_id data is less
    const request = {
      fromDate: fromdate,
      toDate: todate,
      filters: {
        siteIDs: [site_id],
      },
    };

    const [
      chargebackSummary,
      chargebackSearch,
      fundingSearch,
      fundingSummary,
      fundingSummaryByNetwork,
      settlementSummary,
      authorizationSummary,
      authorizationSummaryByDeclined,
      authorizationSearchByDeclined,
    ] = await Promise.all([
      fiservService.getChargeBacksummary(request),
      fiservService.getChargeBackSearch(request),
      fiservService.getFundingSearch(request),
      fiservService.getFundingSummary(request),
      fiservService.getFundingSummaryByNetwork(request),
      fiservService.getSettlementSummary(request),
      fiservService.getAuthorizationSummary(request),
      fiservService.getAuthorizationSummaryByDeclined(request),
      fiservService.getAuthorizationSearchByDeclined(request),
    ]);
    const merchantReportGenerator = new MerchantReportGenerator(
      authorizationSearchByDeclined,
      authorizationSummary,
      authorizationSummaryByDeclined,
      chargebackSummary,
      chargebackSearch,
      fundingSearch,
      fundingSummary,
      fundingSummaryByNetwork,
      settlementSummary
    );

    const response = await merchantReportGenerator.processFiserResponse();

    return response;
  }
}
