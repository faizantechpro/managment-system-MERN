import axios from 'axios';
import { Article } from './Article';

export class NewsDataAPI {
  _url = 'https://newsdata.io/api/1';
  _apiKey = process.env.NEWSDATA_KEY;

  constructor() {
    // super('bing');
  }

  async request(path: string, query?: any): Promise<any> {
    return await axios.get(`${this._url}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...query, apikey: this._apiKey },
    });
  }

  serializeArticle(a: any): Article {
    return {
      title: a.title,
      blurb: a.description,
      body: a.content,
      author: a.creator,
      published: a.pubDate,
      image: a.image_url,
      source: a.source_id,
      url: a.link,
    };
  }

  async getTopHeadlines(opts: any): Promise<any> {
    const results: any = {
      total: 0,
      articles: [],
    };

    let resp = null;

    let query: any = {
      country: opts.country || 'us',
      page: opts.page,
      language: 'en',
    };

    console.log(query);

    // /everything provides different search
    if (opts.q !== '') {
      query = {
        q: opts.q,
        page: opts.page,
        // just return results from 1 month(s) ago
        // free plan only allows 1 month
        // from: moment().subtract(1, 'months').format(),
      };
    }

    // there isnt a way to get international news,
    // so lets only include news from international sources
    if (opts.country === 'world') {
      query = {
        //sources: 'bbc-news,bbc-sport,independent,wired-de',
        page: opts.page,
      };
    }

    try {
      resp = await this.request(`/news`, query);
    } catch (err) {
      console.log(resp);
      return results;
    }

    if ((resp.status && resp.status != 200) || resp.data.status != 'success') {
      return results;
    }

    const articles: Article[] = [];
    resp.data.results.map((a: any) => {
      articles.push(this.serializeArticle(a));
    });

    results.total = resp.data.totalResults;
    results.articles = articles;

    return results;
  }
}
