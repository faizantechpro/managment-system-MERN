import ByJobTitle from './ByJobTitle';
import ByChecks from '../ByChecks';
import { jobsFunction, managemensLevels } from '../../constants';

export const title = [
  {
    name: 'Search By Job Title',
    component: <ByJobTitle />,
  },
  {
    name: 'By Job Function',
    component: (
      <ByChecks
        keyType="title"
        keyFilter="job_functions"
        itemsCheck={jobsFunction}
      />
    ),
  },
  {
    name: 'By Management Level',
    component: (
      <ByChecks
        keyType="title"
        keyFilter="management_levels"
        itemsCheck={managemensLevels}
      />
    ),
  },
];
