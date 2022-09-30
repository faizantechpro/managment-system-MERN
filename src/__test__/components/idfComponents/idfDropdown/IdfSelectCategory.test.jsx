import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
// import IdfDropdownSearch from '../../../../components/idfComponents/idfDropdown/IdfDropdownSearch';

import IdfSelectCategory from '../../../../components/idfComponents/idfDropdown/IdfSelectCategory';
import categoryService from '../../../../services/category.service';
import { CategoryMocks } from '../../../__mocks__/index';

jest.mock('axios');

describe('IdfSelectCategory', () => {
  const label = 'Category';
  const id = 'category';

  beforeEach(async () => {
    axios.get.mockImplementation(() => Promise.resolve(CategoryMocks));
  });

  it('Snapshot', async () => {
    const { container } = render(<IdfSelectCategory id={id} label={label} />);

    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('Should show a label and dropdown component', async () => {
    const { container } = render(<IdfSelectCategory id={id} label={label} />);

    const labelTitle = container.querySelector('label');

    await waitFor(() => expect(labelTitle).toHaveTextContent('Category'));

    const dropdownComponent = container.querySelector('#dropdown-category');

    await waitFor(() => expect(dropdownComponent).toBeTruthy());
  });

  it('Should have a button with text Search for Category', async () => {
    const { container } = render(<IdfSelectCategory id={id} label={label} />);

    const dropdownComponent = container.querySelector('#dropdown-category');

    await waitFor(() =>
      expect(dropdownComponent).toHaveTextContent('Search for Category')
    );
  });

  it('Should have a request to categories', async () => {
    expect(axios.get).not.toHaveBeenCalled();

    const axiosData = await categoryService.GetCategories(null, {
      page: 1,
      limit: 10,
    });

    expect(axios.get).toHaveBeenCalled();

    expect(axiosData).toEqual(CategoryMocks);
  });

  it('Should have a request to categories will be failed', async () => {
    axios.get.mockImplementation(() => Promise.reject(CategoryMocks));

    expect(axios.get).not.toHaveBeenCalled();

    const axiosData = await categoryService
      .GetCategories(null, {
        page: 1,
        limit: 10,
      })
      .catch((err) => err);

    expect(axios.get).toHaveBeenCalled();

    expect(axiosData).toEqual(CategoryMocks);
  });
});
