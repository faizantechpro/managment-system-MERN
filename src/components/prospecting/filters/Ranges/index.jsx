import ByChecks from '../ByChecks';
import { employeesRangelist, revenueList } from '../../constants';

export const revenue = (
  <ByChecks keyType="revenue" keyFilter="range" itemsCheck={revenueList} />
);

export const employees = (
  <ByChecks
    keyType="employees"
    keyFilter="range"
    itemsCheck={employeesRangelist}
  />
);
