import Trash from '../../../assets/svg/brands/trash.svg';
import stringConstants from '../../../utils/stringConstants.json';

const FeedFileDeleted = ({ data }) => {
  return (
    <>
      <div className="card">
        <div className="card-body py-2">
          <ul className="list-group list-group-flush list-group-no-gutters">
            <li className="list-group-item">
              <div className="row align-items-center gx-2">
                <div className="col-auto">
                  <img
                    className="avatar avatar-xs avatar-4by3"
                    src={Trash}
                    alt={'Deleted Icon'}
                  />
                </div>
                <div className="col">
                  <h5 className="mb-1">{data.filename_download}</h5>
                  <ul className="list-inline list-separator text-muted font-size-xs">
                    <li className="list-inline-item">
                      {stringConstants.feed.files.noAvailableLabel}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

FeedFileDeleted.defaultProps = {
  data: {},
};

export default FeedFileDeleted;
