import React from 'react';
import Home from './pages/Home';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import {
  closeAllModals,
  selectModalOpen,
  selectPostModalId,
} from './redux/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import Profile from './pages/Profile';

import styles from './App.module.css';

function App() {
  const modalOpen = useSelector(selectModalOpen);
  const modalId = useSelector(selectPostModalId);
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.contentContainer}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
      {(modalOpen || modalId !== -1) && (
        <div
          onClick={() => {
            dispatch(closeAllModals());
          }}
          id={styles.modalOpen}
        ></div>
      )}
    </>
  );
}

export default App;
