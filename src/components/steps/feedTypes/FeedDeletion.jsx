import stringConstants from '../../../utils/stringConstants.json';
import Avatar from '../../Avatar';

const FeedDeletion = ({ data }) => {
  return (
    <>
      <div className="card">
        <div className="card-body py-2">
          <ul className="list-group list-group-flush list-group-no-gutters">
            <li className="list-group-item">
              <div className="row align-items-center gx-2">
                <div className="col-auto">
                  <Avatar user={data} />
                </div>
                <div className="col">
                  <h5 className="mb-1">{data.name}</h5>
                  <ul className="list-inline list-separator text-muted font-size-xs">
                    <li className="list-inline-item">
                      {stringConstants.feed.deletion.noAvailableLabel}
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

FeedDeletion.defaultProps = {
  data: {},
};

export default FeedDeletion;
