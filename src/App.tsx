import React from 'react';
import Home from './pages/Home';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

import styles from './App.module.css';

function App() {
  return (
    <div className={styles.contentContainer}>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
