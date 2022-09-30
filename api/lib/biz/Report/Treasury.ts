import React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { TreasuryService } from 'lib/database/models/report/report';
import { Component } from './components/Treasury';
import { Report, ReportConfig } from './Report';
import { TreasuryOutput } from './utils';

interface TreasuryConfig extends ReportConfig<'TREASURY'> {
  output?: TreasuryOutput;
}

export class Treasury extends Report<TreasuryConfig> {
  getReportTitle(): string {
    const formattedDate = new Date(this.input.date).toISOString().slice(0, 10);

    return `Treasury Management Prospect Report - ${this.input.client_name} - ${formattedDate}.pdf`;
  }

  async calculate(): Promise<TreasuryOutput> {
    const input = this.input;

    const serviceSavings = input.services.map((service) => {
      return {
        ...service,
        annual_savings: this.calculateItemSavings(service),
      };
    });
    const annualServicesSavings = serviceSavings.reduce(
      (acc, { annual_savings }) => (acc += annual_savings),
      0
    );

    this.output = {
      type: this.type,
      client_name: input.client_name,
      proposed_bank_name: input.proposed_bank_name,

      annual_services_savings: annualServicesSavings,
      annual_estimated_savings: annualServicesSavings,
      services: serviceSavings,
    };

    return this.output;
  }

  private calculateItemSavings(item: TreasuryService) {
    const existingFee = item.total_items * item.item_fee;
    const proposedFee = item.total_items * item.proposed_item_fee;

    return (existingFee - proposedFee) * 12;
  }

  async render() {
    if (!this.output) {
      this.calculate();
    }

    return super.fullRender(
      ReactDOMServer.renderToString(
        React.createElement(Component, {
          updated_at: this.requestDate,
          input: this.input,
          output: this.output!,
        })
      )
    );
  }
}
