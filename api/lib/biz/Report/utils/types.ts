import { TreasuryService } from 'lib/database/models/report/report';

export type TreasuryOutput = {
  type: 'TREASURY';
  client_name: string;
  proposed_bank_name: string;
  annual_services_savings: number; // currency
  annual_estimated_savings: number; // currency
  services: (TreasuryService & {
    annual_savings: number;
  })[];
};
export type ReportOutput = TreasuryOutput;
