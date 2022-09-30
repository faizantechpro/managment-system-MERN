import React from 'react';
import TextBlock from '../blocks/TextBlock';
import BlockDescription from '../blocks/BlockDescription';
import PartnerLogoBlock from '../blocks/PartnerLogoBlock';
import IconTextBlock from '../blocks/IconTextBlock';
import CircleChartTextBlock from '../blocks/CircleChartTextBlock';
import CalendarBlock from '../blocks/CalendarBlock';
import RPMGBlock from '../blocks/RPMGBlock';

export const ReportBlockControls = [
  { id: 1, icon: 'drag_indicator', type: 'move', tooltip: 'Move' },
  { id: 2, icon: 'visibility_off', type: 'hideShow', tooltip: 'Disable' },
  { id: 3, icon: 'add_circle', type: 'addNew', tooltip: 'Insert a new block' },
  { id: 4, icon: 'autorenew', type: 'replace', tooltip: 'Replace' },
  { id: 5, icon: 'swap_horiz', type: 'changePosition', tooltip: 'Revert' },
  { id: 6, icon: 'delete', type: 'remove', tooltip: 'Remove' },
];

export const ReportBlocksType = [
  { id: 1, key: 'All', name: 'All Blocks' },
  { id: 2, key: 'Calendar', name: 'S&P Global' },
  { id: 3, key: 'CircleChartText', name: 'RPMG' },
  { id: 4, key: 'Text', name: 'Faster Payments' },
  { id: 5, key: 'IconText', name: 'Custom' },
];

export const defaultReportBlocks = [
  {
    id: 1,
    direction: 'flex-row-reverse',
    description: [
      'The average Days Sales Outstanding (DSO) of your peer group.',
    ],
    data: {
      value: '64',
      text: 'Days',
    },
    type: 'Calendar',
    partnerLogo: {
      src: '/img/integrations/sp-global.png',
      position: 'float-right',
      style: { width: 100 },
    },
  },
  {
    id: 2,
    direction: '',
    description: [
      'On average, your peers pay (36%) of all payables between $2,500 - $10,000 by commercial card, providing a substantial increase in Days Payables.',
      'Peers are leveraging commercial card to improve Working Capital.',
    ],
    data: {
      labels: ['Card', 'Others'],
      data: {
        data: [36, 64],
        backgroundColor: ['#5cb85c', '#eee'],
      },
    },
    type: 'RPMG',
    partnerLogo: {
      src: '/img/integrations/RPMG-Logo.png',
      position: 'float-left',
    },
    options: { cutout: 40 },
  },
  {
    id: 3,
    direction: 'flex-row-reverse',
    description: [
      'A savings of $2.50 per item can be realized by moving from checks to digital payments.',
    ],
    data: {
      value: '$2.50',
      text: 'Savings',
    },
    type: 'Text',
    partnerLogo: {
      src: '/img/integrations/FasterPayments-Logo.jpeg',
      position: 'float-right',
    },
  },
  {
    id: 4,
    direction: '',
    description: [
      'The average Days Sales Outstanding (DSO) of your peer group.',
    ],
    data: {
      value: '45',
      text: 'Days',
    },
    type: 'Calendar',
    partnerLogo: {
      src: '/img/integrations/sp-global.png',
      position: 'float-left',
      style: { width: 100 },
    },
  },
  {
    id: 5,
    direction: 'flex-row-reverse',
    description: [
      'On average, your peers pay (40%) of all payables between $2,500 - $10,000 by ACH.',
    ],
    data: {
      labels: ['ACH', 'Others'],
      data: {
        data: [40, 60],
        backgroundColor: ['#c1232a', '#eee'],
      },
    },
    type: 'CircleChartText',
    partnerLogo: {
      src: '/img/integrations/RPMG-Logo.png',
      position: 'float-right',
    },
    options: { cutout: 40 },
  },
  {
    id: 6,
    direction: '',
    description: [
      'Faster payments networks now enable instant payments to be sent to approximately 80% of the DDAs in the United States.',
    ],
    data: {
      value: '80%',
      text: 'DDAs',
    },
    type: 'Text',
    partnerLogo: {
      src: '/img/integrations/FasterPayments-Logo.jpeg',
      position: 'float-left',
    },
  },
  {
    id: 7,
    direction: 'flex-row-reverse',
    iconConfig: { icon: 'dvr', color: 'text-blue' },
    description: [
      'Faster payments networks now enable instant payments to be sent to approximately 80% of the DDAs in the United States.',
    ],
    data: {
      text: 'Faster Payments',
    },
    type: 'IconText',
    partnerLogo: {
      src: '/img/integrations/FasterPayments-Logo.jpeg',
      position: 'float-right',
    },
  },
  {
    id: 8,
    direction: 'flex-row-reverse',
    iconConfig: { icon: 'info', color: 'text-black' },
    description: [
      '*Does not display all payment types. For further details, please review your Account Analysis statement.',
      '*Bank Deposit Assessment fess are fess associated with FDIC.',
    ],
    data: {
      text: 'Legal',
    },
    type: 'IconText',
    partnerLogo: {},
  },
];

export const DynamicBlock = ({ type, children, ...props }) => {
  switch (type) {
    case 'RPMG':
      return React.cloneElement(
        <RPMGBlock
          {...props}
          partner={
            <PartnerLogoBlock
              logo={props.partnerLogo.src}
              placement={props.partnerLogo.position}
              style={props.partnerLogo.style}
            />
          }
        />
      );
    case 'Text':
      return React.cloneElement(
        <TextBlock
          {...props}
          text={<BlockDescription texts={props.description} />}
          partner={
            <PartnerLogoBlock
              logo={props.partnerLogo.src}
              placement={props.partnerLogo.position}
              style={props.partnerLogo.style}
            />
          }
        />
      );
    case 'IconText':
      return React.cloneElement(
        <IconTextBlock
          {...props}
          text={<BlockDescription texts={props.description} />}
          partner={
            <PartnerLogoBlock
              logo={props.partnerLogo.src}
              placement={props.partnerLogo.position}
              style={props.partnerLogo.style}
            />
          }
        />
      );
    case 'CircleChartText':
      return React.cloneElement(
        <CircleChartTextBlock
          {...props}
          text={<BlockDescription texts={props.description} />}
          partner={
            <PartnerLogoBlock
              logo={props.partnerLogo.src}
              placement={props.partnerLogo.position}
              style={props.partnerLogo.style}
            />
          }
        />
      );
    case 'Calendar':
      return React.cloneElement(
        <CalendarBlock
          {...props}
          text={<BlockDescription texts={props.description} />}
          partner={
            <PartnerLogoBlock
              logo={props.partnerLogo.src}
              placement={props.partnerLogo.position}
              style={props.partnerLogo.style}
            />
          }
        />
      );
  }
};
