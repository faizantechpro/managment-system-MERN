import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import SearchDefault from '../components/commons/SearchDefault';
import NewsFilter from '../components/news/NewsFilter';
import Newspaper from '../components/news/Newspaper';
import { FilterMenuData } from '../components/news/constant';
import newsService from '../services/news.service';
import SkeletonNewsLoader from '../components/loaders/NewsLoader';

const News = () => {
  const [searchValue, setSearchValue] = useState('');
  const [search, setSearch] = useState(searchValue);
  const [heading, setHeading] = useState('Top headlines');
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('top-headlines');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    maxItem: 10,
    totalPages: 1,
  });

  useEffect(async () => {
    if (!loading) {
      await getNews();
    }
  }, [filter, page, search]);

  const getCategory = () => {
    const exclude = ['top-headlines', 'us'];
    if (exclude.includes(filter)) {
      return '';
    }
    return filter;
  };

  const getNews = async (e) => {
    setLoading(true);
    try {
      const query = {
        page: page,
        q: search,
        category: getCategory(),
        country: 'us',
      };

      const resp = await newsService.getNews(query);
      setNews(resp.data.articles);
      setPagination({
        ...pagination,
        maxItem: resp.data.total,
        totalPages: Math.round(resp.data.total / 10),
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const reset = async () => {
    setSearch('');
    setSearchValue('');
    setFilter('top-headlines');
    setHeading('Top headlines');
    setPagination({
      page: 1,
      maxItem: 10,
      totalPages: 1,
    });
  };

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      setPage(1);
      setHeading(`Search results for "${searchValue}":`);
      setPagination({ ...pagination, page: 1, maxItem: 10 });
      setSearch(event.target.value);
    }
  };

  const onPageChange = async (page) => {
    console.log(page);
    setPage(page);
    setPagination({ ...pagination, page: page });
    // await getNews();
  };

  const onSearchInput = (e) => {
    if (e.target.value === '') {
      reset();
    } else {
      setSearchValue(e.target.value);
    }
  };

  const setActiveFilter = (e) => {
    if (searchValue !== '') {
      setSearchValue('');
      setSearch('');
    }
    setHeading(e.name);
    setFilter(e.id);
    setPage(1);
    setPagination({
      page: 1,
      maxItem: 10,
      totalPages: 1,
    });
  };

  return (
    <>
      <Row className="w-100" noGutters>
        <Col xs={3} className="py-3">
          <Card className="m-0">
            <Card.Header className="w-100 border-bottom-0 mx-0 px-3 py-3 mb-1">
              <SearchDefault
                id="search-news"
                placeholder="Search"
                label="Search"
                value={searchValue}
                onHandleKeyPress={handleKeyPress}
                onHandleChange={onSearchInput}
              />
            </Card.Header>
            <Card.Body className="px-3 pt-0 pb-3">
              {FilterMenuData.map((menu) => (
                <NewsFilter
                  key={menu.id}
                  icon={menu.icon}
                  title={menu.name}
                  id={menu.id}
                  active={filter}
                  setActive={setActiveFilter}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={9} className="px-2 py-3">
          <Card className="m-0">
            <Card.Header className="w-100 border-bottom-2 mx-0 px-3 py-2 mb-2">
              <h3 className="mb-0">{heading}</h3>
              <p className="mt-2">
                {news.length > 0
                  ? `${10 * page} of ${pagination.maxItem} Results`
                  : ''}
              </p>
            </Card.Header>
            <Card.Body className="px-3 pt-0 pb-3">
              {loading ? (
                <SkeletonNewsLoader />
              ) : (
                <Newspaper
                  articles={news}
                  pagination={pagination}
                  onPageChange={(p) => onPageChange(p)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default News;
