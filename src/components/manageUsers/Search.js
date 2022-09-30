import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Search({
  onHandleChange,
  searchPlaceholder,
  classnames,
  variant,
  onHandleKeyPress,
  tooltip,
}) {
  const css = classnames || 'col-sm-6 col-md-4 mb-3 mb-sm-0';

  return (
    <div className={css}>
      <form onSubmit={(e) => e.preventDefault()} title={tooltip}>
        <div className="input-group global-search rounded border">
          <div className="input-group-prepend">
            <div className="input-group-text border-0 pr-0 input-group-text">
              <i
                className={`material-icons-outlined ${variant && 'mx-2'}`}
                data-uw-styling-context="true"
              >
                search
              </i>
            </div>
          </div>
          {tooltip ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-badge`}>{tooltip}</Tooltip>}
            >
              <input
                id="datatableSearch"
                type={variant ? 'text' : 'search'}
                className={variant ? 'px-5 py-1 variant-input' : 'form-control'}
                placeholder={searchPlaceholder || 'Search users'}
                aria-label={searchPlaceholder || 'Search users'}
                data-uw-styling-context="true"
                onChange={onHandleChange}
                onKeyPress={onHandleKeyPress}
              />
            </OverlayTrigger>
          ) : (
            <input
              id="datatableSearch"
              type={variant ? 'text' : 'search'}
              className={
                variant
                  ? 'px-5 py-1 variant-input'
                  : 'form-control border-0 search-input mw-100'
              }
              placeholder={searchPlaceholder || 'Search users'}
              aria-label={searchPlaceholder || 'Search users'}
              data-uw-styling-context="true"
              onChange={onHandleChange}
              onKeyPress={onHandleKeyPress}
            />
          )}
        </div>
      </form>
    </div>
  );
}
