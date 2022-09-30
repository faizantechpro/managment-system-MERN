import { NewsAPIOrg } from './newsorg';
import { NewsDataAPI } from './newsdata';

export type NewsService = 'newsapi' | 'newsdata';

export function newsFactory(type: NewsService = 'newsapi') {
  if (type === 'newsapi') {
    return new NewsAPIOrg();
  } else if (type === 'newsdata') {
    return new NewsDataAPI();
  }
  throw new Error('unknown prospect service');
}
