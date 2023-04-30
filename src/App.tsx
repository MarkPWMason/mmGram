import React from 'react';
import Home from './pages/Home';

import styles from './App.module.css'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className={styles.contentContainer}>
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
