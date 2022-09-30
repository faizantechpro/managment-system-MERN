import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

export default function UsersSubheading({ activeTab, toggle }) {
  return (
    <>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              toggle('1');
            }}
          >
            <i
              className="material-icons-outlined nav-icon mr-1"
              data-uw-styling-context="true"
            >
              group_add
            </i>
            Users
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              toggle('2');
            }}
          >
            <i
              className="material-icons-outlined nav-icon mr-1"
              data-uw-styling-context="true"
            >
              lock
            </i>
            Roles
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              toggle('3');
            }}
          >
            <i
              className="material-icons-outlined nav-icon mr-1"
              data-uw-styling-context="true"
            >
              groups
            </i>
            Groups
          </NavLink>
        </NavItem>
      </Nav>
    </>
  );
}
