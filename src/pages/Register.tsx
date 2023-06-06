import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserValues } from '../redux/slices/userSlice';

import styles from './Register.module.css';



const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');

  const dispatch = useDispatch();

  return (
    <div className={styles.registerContainer}>
      <form
        className={styles.register}
        onSubmit={(e) => {
          e.preventDefault();
          fetch(`http://localhost:5000/register`, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
              username: username,
              password: password,
              inviteCode: inviteCode,
            }),
          })
            .then((res) => {
              if (res.status === 200) {
                return res.json();
              } else if (res.status === 409) {
                //409 - Conflict
                throw new Error('Username exists');
              } else if (res.status === 403) {
                throw new Error('Unauthorised Action');
              } else {
                throw new Error('Server Error');
              }
            })
            .then((data) => {
              if (data.isLoggedIn === true) {
                dispatch(
                  setUserValues({
                    username: data.username,
                    user_id: data.user_id,
                    auth_token: data.authToken,
                  })
                );
                window.location.href = '/';
              } else if (data.isLoggedIn === false) {
                window.location.href = '/login';
              }
            })
            .catch((err) => {
              if (err.message === 'Username exists') {
                alert('Username already exists please choose another.');
              } else if(err.message === 'Unauthorised Action'){
                alert('Invite Code Incorrect');
              } else {
                alert('There was a problem.');
              }
              console.error(err);
            });
        }}
      >
        <h1 className={styles.registerTitle}>Register</h1>
        <input
          className={styles.registerUsername}
          type="text"
          placeholder="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          className={styles.registerPassword}
          type="password"
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          className={styles.registerCode}
          type="text"
          placeholder="Invite Code"
          onChange={(e) => {
            setInviteCode(e.target.value);
          }}
        />
        <input
          className={styles.registerBtn}
          type="submit"
          name=""
          id=""
          value="Register"
        />
      </form>
    </div>
  );
};

export default Register;
