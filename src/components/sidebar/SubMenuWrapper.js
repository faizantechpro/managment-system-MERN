import { useEffect, useContext } from 'react';

import { CategoriesContext } from '../../contexts/categoriesContext';
import { useAppContext } from '../../contexts/appContext';
import categoryService from '../../services/category.service';

function SubMenuWrapper(props) {
  const { isAuthenticated } = useAppContext();
  const { icon, title, children, active, setActive } = props;
  const { refresh, setCategoryList } = useContext(CategoriesContext);

  useEffect(() => {
    async function getCategories() {
      const resp = await categoryService
        .GetCategories(null, { limit: 75 })
        .catch((err) => console.log(err));

      const { data } = resp || {};

      const newResponse = data?.map((item) => {
        const path = item.title.toLocaleLowerCase().trim().replace(/ /g, '-');

        return {
          ...item,
          path: `/training/categories/${path}`,
        };
      });

      setCategoryList(newResponse);
    }

    if (isAuthenticated && title === 'Explore') {
      getCategories();
    }
  }, [isAuthenticated, refresh]);

  const toggle = () => setActive(active !== title ? title : '');

  const className = active === title && 'show';

  return (
    <li className={`navbar-vertical-aside-has-menu ${className}`}>
      <div
        className="js-navbar-vertical-aside-menu-link nav-link nav-link-toggle cursor-pointer"
        onClick={toggle}
      >
        {icon && <i className="material-icons-outlined nav-icon">{icon}</i>}
        <span className="navbar-vertical-aside-mini-mode-hidden-elements text-truncate cursor-pointer fw-bold">
          {title}
        </span>
      </div>
      <ul className={`js-navbar-vertical-aside-submenu nav nav-sub`}>
        {children}
      </ul>
    </li>
  );
}

export default SubMenuWrapper;
