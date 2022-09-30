import axios from 'axios';
import { Article } from './Article';
import moment from 'moment';

export class NewsAPIOrg {
  _url = 'https://newsapi.org/v2';
  _apiKey = process.env.NEWSAPI_KEY;

  constructor() {
    // super('bing');
  }

  async request(path: string, query?: any): Promise<any> {
    return await axios.get(`${this._url}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': `${this._apiKey}`,
      },
      params: query,
    });
  }

  serializeArticle(a: any): Article {
    return {
      title: a.title,
      blurb: a.description,
      body: a.content,
      author: a.author,
      published: a.publishedAt,
      image: a.urlToImage,
      source: a.source.name,
      url: a.url,
    };
  }

  async getTopHeadlines(opts: any): Promise<any> {
    const results: any = {
      total: 0,
      articles: [],
    };

    let path = 'top-headlines';
    let resp = null;

    let query: any = {
      country: opts.country || 'us',
      category: opts.category || '',
      pageSize: 10,
      page: opts.page,
      q: opts.q || '',
    };

    // /everything provides different search
    if (opts.q !== '') {
      path = 'everything';
      query = {
        q: opts.q,
        page: opts.page,
        sortBy: 'publishedAt',
        pageSize: 10,
        // just return results from 1 month(s) ago
        // free plan only allows 1 month
        from: moment().subtract(1, 'months').format(),
      };
    }

    // there isnt a way to get international news,
    // so lets only include news from international sources
    if (opts.category === 'world') {
      query = {
        sources: 'bbc-news,bbc-sport,independent,wired-de',
        page: opts.page,
        pageSize: 10,
      };
    }

    try {
      resp = await this.request(`/${path}`, query);
    } catch (err) {
      return results;
    }

    if ((resp.status && resp.status != 200) || resp.data.status != 'ok') {
      return results;
    }

    const articles: Article[] = [];
    resp.data.articles.map((a: any) => {
      articles.push(this.serializeArticle(a));
    });

    results.total = resp.data.totalResults;
    results.articles = articles;

    return results;
  }
}
