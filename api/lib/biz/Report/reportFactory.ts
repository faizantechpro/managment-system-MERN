import { ReportType } from 'lib/database/models/report/report';
import { Report, ReportConfig } from './Report';
import { Treasury } from './Treasury';

const configToReport: {
  [K in ReportType]?: {
    new (config: any, tmpLocation: string): Report<ReportConfig<K>>;
  };
} = {
  TREASURY: Treasury,
};

export function reportFactory<T extends ReportConfig>(
  config: T,
  tmpLocation: string
) {
  const ReportClass = configToReport[config.input.type];

  if (!ReportClass) {
    return;
  }

  return new ReportClass(config, tmpLocation);
}
