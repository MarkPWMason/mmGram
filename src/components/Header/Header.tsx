import React from 'react';

import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserValues, selectAuthToken } from '../../redux/slices/userSlice';

const Header = () => {
  const authToken = useSelector(selectAuthToken);
  const dispatch = useDispatch();

  return (
    <div className={styles.headerContainer}>
      <Link to={'/'}>Home</Link>
      <Link to={'/register'}>Register</Link>
      {authToken === '' && <Link to={'/login'}>Login</Link>}
      {authToken !== '' && <p onClick={() => {
        dispatch(removeUserValues())
      }}>Logout</p>}
    </div>
  );
};

export default Header;
