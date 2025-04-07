// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Read from './pages/Read';
import './index.css'

function App() {
  

  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/read" element={<Read />} />
      </Routes>
    </Layout>
  </Router>
  )
}

export default App
