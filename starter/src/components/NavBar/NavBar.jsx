import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

export const Navigation = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.menuItems}>
        <li className={styles.title}>
          <Link to="/">Events</Link>
        </li>
        <li>
          <Link to="/event/1">Event</Link>
        </li>
      </ul>
    </nav>
  );
};
