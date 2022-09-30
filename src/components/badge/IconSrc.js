import defaultIcon from '../../assets/png/badges/default.png';
import workingCapitalBronze from '../../assets/png/badges/Working Capital-Bronze.png';
import workingCapitalSilver from '../../assets/png/badges/Working Capital-Silver.png';
import workingCapitalGold from '../../assets/png/badges/Working Capital-Gold.png';
import achBronze from '../../assets/png/badges/ACH-Bronze.png';
import achSilver from '../../assets/png/badges/ACH-silver.png';
import achGold from '../../assets/png/badges/ACH-Gold.png';
import merchantBronze from '../../assets/png/badges/Merchant-Bronze.png';
import merchantSilver from '../../assets/png/badges/Merchant-Silver.png';
import merchantGold from '../../assets/png/badges/Merchant-Gold.png';
import businessCardsBronze from '../../assets/png/badges/Business Card-Bronze.png';
import businessCardsSilver from '../../assets/png/badges/Business Card-Silver.png';
import businessCardsGold from '../../assets/png/badges/Business Card-Gold.png';
import lockboxBronze from '../../assets/png/badges/Lockbox-Bronze.png';
import lockboxSilver from '../../assets/png/badges/Lockbox-Silver.png';
import lockboxGold from '../../assets/png/badges/Lockbox-Gold.png';
import hrmBronze from '../../assets/png/badges/HRM-Bronze.png';
import hrmSilver from '../../assets/png/badges/HRM-Silver.png';
import hrmGold from '../../assets/png/badges/HRM-Gold.png';
import wiresBronze from '../../assets/png/badges/Wire-Bronze.png';
import wiresSilver from '../../assets/png/badges/Wire-Silver.png';
import wiresGold from '../../assets/png/badges/Wire-Gold.png';
import salesStrategyBronze from '../../assets/png/badges/Sales Strategy-Bronze.png';
import salesStrategySilver from '../../assets/png/badges/Sales Strategy-Silver.png';
import salesStrategyGold from '../../assets/png/badges/Sales Strategy-Gold.png';

const getIconSrc = (name) => {
  switch (name) {
    case 'workingCapitalBronze':
      return workingCapitalBronze;
    case 'workingCapitalSilver':
      return workingCapitalSilver;
    case 'workingCapitalGold':
      return workingCapitalGold;
    case 'achBronze':
      return achBronze;
    case 'achSilver':
      return achSilver;
    case 'achGold':
      return achGold;
    case 'merchantBronze':
      return merchantBronze;
    case 'merchantSilver':
      return merchantSilver;
    case 'merchantGold':
      return merchantGold;
    case 'businessCardsBronze':
      return businessCardsBronze;
    case 'businessCardsSilver':
      return businessCardsSilver;
    case 'businessCardsGold':
      return businessCardsGold;
    case 'lockboxBronze':
      return lockboxBronze;
    case 'lockboxSilver':
      return lockboxSilver;
    case 'lockboxGold':
      return lockboxGold;
    case 'hrmBronze':
      return hrmBronze;
    case 'hrmSilver':
      return hrmSilver;
    case 'hrmGold':
      return hrmGold;
    case 'wiresBronze':
      return wiresBronze;
    case 'wiresSilver':
      return wiresSilver;
    case 'wiresGold':
      return wiresGold;
    case 'salesStrategyBronze':
      return salesStrategyBronze;
    case 'salesStrategySilver':
      return salesStrategySilver;
    case 'salesStrategyGold':
      return salesStrategyGold;
    default:
      return defaultIcon;
  }
};

export default getIconSrc;
