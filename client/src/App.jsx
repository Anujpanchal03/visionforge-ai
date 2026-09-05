import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Result from './pages/Result';
import Gallery from './pages/Gallery';
import Dashboard from './pages/Dashboard';
import BuyCredit from './pages/BuyCredit';
import Verify from './pages/Verify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './context/AppContext';

const App = () => {
  const { showLogin } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <ToastContainer position="bottom-right" autoClose={3500} theme="light" />
      
      <div>
        <Navbar />
        {showLogin && <Login />}
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/generate" element={<Result />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buy" element={<BuyCredit />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;