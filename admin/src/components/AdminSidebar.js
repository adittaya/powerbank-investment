import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <Nav vertical className="mt-3">
        <NavItem>
          <NavLink
            tag={Link}
            to="/"
            className={isActive('/') ? 'active' : ''}
          >
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to="/users"
            className={isActive('/users') ? 'active' : ''}
          >
            User Management
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to="/plans"
            className={isActive('/plans') ? 'active' : ''}
          >
            Plan Management
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to="/withdrawals"
            className={isActive('/withdrawals') ? 'active' : ''}
          >
            Withdrawal Management
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to="/referrals"
            className={isActive('/referrals') ? 'active' : ''}
          >
            Referral Tracking
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to="/settings"
            className={isActive('/settings') ? 'active' : ''}
          >
            Settings
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default AdminSidebar;