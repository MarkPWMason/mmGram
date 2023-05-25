import React from 'react';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeUserValues,
  selectAuthToken,
  selectUsername,
} from '../../redux/slices/userSlice';

import styles from './Header.module.css';

const Header = () => {
  const authToken = useSelector(selectAuthToken);
  const username = useSelector(selectUsername);
  const dispatch = useDispatch();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.homeBtnContainer}>
        <Link to={'/'}>
          <img
            className={styles.homeBtn}
            src="/images/home.svg"
            alt="Home"
          />
        </Link>
        <Link to={'/profile'} id={styles.usernameLink}>{username}</Link>
      </div>

      <div className={styles.accountBtn}>
        <Link className={styles.accountBtnContent} to={'/register'}>Register</Link>
        {authToken === '' && <Link className={styles.accountBtnContent} to={'/login'}>Login</Link>}
        {authToken !== '' && (
          <p className={styles.accountBtnContent}
            onClick={() => {
              dispatch(removeUserValues());
            }}
          >
            Logout
          </p>
        )}
      </div>
    </div>
  );
};

export default Header;
