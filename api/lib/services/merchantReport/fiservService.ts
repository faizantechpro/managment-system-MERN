import { FiserVCall } from './fiserVCalling';
import { FISERV_PATHS } from '../../utils/constants';

export class FiserVService {
  protected getContextQuery() {
    return {};
  }
  async getFundingSearch(request: any) {
    const service = new FiserVCall();

    const response = await service.callFiserVApi(
      request,
      FISERV_PATHS.FUNDING_SEARCH
    );

    return response;
  }
  async getSettlementSummary(request: any) {
    const service = new FiserVCall();

    const response = await service.callFiserVApi(
      request,
      FISERV_PATHS.SETTLEMENT_SUMMARY
    );

    return response;
  }

  async getFundingSummary(request: any) {
    const service = new FiserVCall();

    const response = await service.callFiserVApi(
      request,
      FISERV_PATHS.FUNDING_SUMMARY
    );

    return response;
  }

  async getFundingSummaryByNetwork(request: any) {
    const service = new FiserVCall();

    const authRequest = { ...request };
    authRequest.summaryBy = 'ProductCode';
    const response = await service.callFiserVApi(
      authRequest,
      FISERV_PATHS.FUNDING_SUMMARY
    );

    return response;
  }
  async getAuthorizationSearch(request: any) {
    const service = new FiserVCall();

    const response = await service.callFiserVApi(
      request,

      FISERV_PATHS.AUTHORIZATION_SEARCH
    );

    return response;
  }

  async getAuthorizationSearchByDeclined(request: any) {
    const authRequest = { ...request };
    authRequest.filters.approvalCodes = ['Declined'];

    return await this.getAuthorizationSearch(authRequest);
  }

  async getAuthorizationSearchByApproved(request: any) {
    const authRequest = { ...request };
    authRequest.filters.approvalCodes = ['Approved'];

    return await this.getAuthorizationSearch(authRequest);
  }

  async getAuthorizationSummary(request: any) {
    const service = new FiserVCall();

    const response = await service.callFiserVApi(
      request,

      FISERV_PATHS.AUTHORIZATION_SUMMARY
    );

    return response;
  }

  async getAuthorizationSummaryByApproved(request: any) {
    const authRequest = { ...request };
    authRequest.filters.approvalCodes = ['Approved'];
    const response = await this.getAuthorizationSummary(authRequest);

    return response;
  }

  async getAuthorizationSummaryByDeclined(request: any) {
    const authRequest = { ...request };
    authRequest.filters.approvalCodes = ['Declined'];
    const response = await this.getAuthorizationSummary(authRequest);

    return response;
  }

  async getChargeBacksummary(request: any) {
    const service = new FiserVCall();

    const response = await service.callFiserVApi(
      request,
      FISERV_PATHS.CHARGEBACKS_SUMMARY
    );

    return response;
  }

  async getChargeBackSearch(request: any) {
    const service = new FiserVCall();

    const response = await service.callFiserVApi(
      request,
      FISERV_PATHS.CHARGEBACKS_SEARCH
    );

    return response;
  }
}
