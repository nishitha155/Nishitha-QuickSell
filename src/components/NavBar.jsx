import React, { useState } from 'react';
import styles from  './styles/NavBar.module.css';
import display from '../icons_FEtask/Display.svg';
import down from '../icons_FEtask/down.svg';

const Navbar = ({ grouping, setGrouping, ordering, setOrdering }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.navbar}>
      <button className={styles.toggle} onClick={toggleDropdown}>
        <img src={display} alt="Display" className={styles.icon} /> Display <img src={down} alt="Down" className={styles.icon} />
      </button>
      {isOpen && (
        <div className={styles.content}>
          <div className={styles.item}>
            <label>Grouping</label>
            <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className={styles.item}>
            <label>Ordering</label>
            <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
