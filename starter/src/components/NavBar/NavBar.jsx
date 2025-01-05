import React from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

export const Navigation = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.menuItems}>
        <li className={styles.menuItem}>
          <Link className={styles.menuLink} to="/">
            Events
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link className={styles.menuLink} to="/event/1">
            Event
          </Link>
        </li>
      </ul>
    </nav>
  );
};
