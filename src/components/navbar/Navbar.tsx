import React from 'react';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  return (
    <div className={styles.Navbar}>
      <ol>
        <li>
          <button>First Button</button>
        </li>
        <li>
          <button>Second Button</button>
        </li>
      </ol>
    </div>
  );
};

export default Navbar;
