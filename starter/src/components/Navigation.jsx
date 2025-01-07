import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active link styling

export const Navigation = () => {
  return (
    <nav className="navbar">
      <ul className="menuItems">
        <li className="menuItem">
          <NavLink
            className={({ isActive }) =>
              isActive ? "menuLink activeLink" : "menuLink"
            }
            to="/"
          >
            Events
          </NavLink>
        </li>
        <li className="menuItem">
          <NavLink
            className={({ isActive }) =>
              isActive ? "menuLink activeLink" : "menuLink"
            }
            to="/event/1"
          >
            Event
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
