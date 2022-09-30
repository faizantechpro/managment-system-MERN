import { RocketReachService } from './RocketReach';
import { UpleadService } from './Uplead';
import { PeopleDataLabs } from './PeopleDataLabs';

type ProspectService = 'rocketreach' | 'uplead' | 'peopledatalabs';

export function prospectFactory(type: ProspectService = 'rocketreach') {
  if (type === 'rocketreach') {
    return new RocketReachService();
  } else if (type === 'uplead') {
    return new UpleadService();
  } else if (type === 'peopledatalabs') {
    return new PeopleDataLabs();
  }

  throw new Error('unknown prospect service');
}
