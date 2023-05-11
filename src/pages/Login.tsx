import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserValues } from '../redux/slices/userSlice';

import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState<string>('test1');
  const [password, setPassword] = useState<string>('test2');

  const dispatch = useDispatch();

  return (
    <div className={styles.loginContainer}>
      <form
        className={styles.login}
        onSubmit={(e) => {
          e.preventDefault();
          fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          })
            .then((res: any) => {
              if (res.status === 200) {
                return res.json();
              } else if (res.status === 404) {
                throw new Error('User not found');
              }
            })
            .then((data) => {
              console.log(data);
              dispatch(
                setUserValues({
                  username: data.username,
                  user_id: data.user_id,
                  auth_token: data.authToken,
                })
              );
              window.location.href = '/';
            })
            .catch((err) => {
              if (err.message === 'User not found') {
                alert('User not found');
              } else {
                alert('There was a problem.');
              }
            });
        }}
      >
        <h1 className={styles.loginTitle}>LOGIN</h1>
        <input
          className={styles.loginUsername}
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          className={styles.loginPassword}
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button className={styles.loginBtn} type="submit">
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Login;
