import React from 'react';
import './Pages.css'; // Import the CSS file

const Pages = ({ totalPages, currentPage, onPageClick }) => {
  const handlePageClick = (pageNumber) => {
    onPageClick(pageNumber);
  };

  return (
    <div className="pagination">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={`page-button ${index + 1 === currentPage ? 'active' : ''}`}
          onClick={() => handlePageClick(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pages;
