import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserValues } from '../redux/slices/userSlice';

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          })
            .then((res) => {
              if (res.status === 200) {
                return res.json();
              } else if (res.status === 409) {
                //409 - Conflict
                throw new Error('Username exists');
              } else {
                throw new Error('Server Error');
              }
            })
            .then((data) => {
              console.log('Data: ', data);
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
                console.log('send to login page');
                window.location.href = '/login';
              }
            })
            .catch((err) => {
              if (err.message === 'Username exists') {
                alert('Username already exists please choose another.');
              } else {
                alert('There was a problem.');
              }
              console.error(err);
            });
        }}
      >
        <input
          type="text"
          placeholder="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input type="submit" name="" id="" value="Sub" />
      </form>
    </div>
  );
};

export default Register;
