import React from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="navbar">
      <ul className="menuItems">
        <li className="menuItem">
          <Link className="menuLink" to="/">
            Events
          </Link>
        </li>
        <li className="menuItem">
          <Link className="menuLink" to="/event/1">
            Event
          </Link>
        </li>
      </ul>
    </nav>
  );
};
