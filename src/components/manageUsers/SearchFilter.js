function SearchFilter(props) {
  const { toogleSearchClassName, options, onHandleSelect, filterSelected } =
    props;

  const selectOptions = () =>
    options?.map((option) => {
      let active;

      if (filterSelected === option.name) {
        active = 'selected-item';
      }

      return (
        <li
          key={option.id}
          className={`select2-results__option fs-6 lh-base p-2 item ${active}`}
          onClick={() => onHandleSelect(option)}
        >
          <span>{option.title}</span>
        </li>
      );
    });

  return (
    <div
      dir="ltr"
      className={`select2-dropdown select2-dropdown--below ${toogleSearchClassName} position-relative mt-2 border border-1 border-primary`}
    >
      <div className="position-absolute bg-white border border-1 border-primary search-card">
        <div className="select2-results">
          <ul
            className="select2-results__options list-unstyled"
            role="listbox"
            id="select2-4dd5-results"
            aria-expanded="true"
            aria-hidden="false"
          >
            {selectOptions()}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
