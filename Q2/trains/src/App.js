// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AllTrains from './components/AllTrains';
import SingleTrain from './components/SingleTrain';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <Routes> {/* Use Routes */}
          <Route path="/" element={<AllTrains />} />
          <Route path="/train/:trainNumber" element={<SingleTrain />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
