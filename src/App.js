import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Assuming there are 10 pages

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path='/' 
            element={
              <Home 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageClick={handlePageClick} 
              />
            } 
          />
          <Route 
            path='/page:id' 
            element={
              <Home 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageClick={handlePageClick} 
              />
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
