import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css"; // Link to the external CSS file for styling

export const Navigation = () => {
  return (
    <nav className="navigation-container">
      <div className="navigation-links">
        <NavLink to="/" className="nav-link">
          {({ isActive }) => (
            <span className={isActive ? "active" : ""}>Events</span>
          )}
        </NavLink>

        <NavLink to="/event/1" className="nav-link">
          {({ isActive }) => (
            <span className={isActive ? "active" : ""}>Event</span>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
