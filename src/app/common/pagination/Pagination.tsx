import React from 'react';

interface PaginationProps {
  pageIndex: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageIndex, totalPages, onPrevious, onNext }) => {
  return (
    totalPages > 1  ? <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <button
        disabled={pageIndex === 0}
        onClick={onPrevious}
        className='bg-light'
        style={{
          marginRight: "10px",
          width: "100px",
          height: "40px",
          borderRadius: "20px",
          // backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          border: "2px solid white",
          padding: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Previous
      </button>

      <button
        disabled={pageIndex === totalPages - 1}
        className='bg-light'
        onClick={onNext}
        style={{
          marginLeft: "10px",
          width: "100px",
          height: "40px",
          borderRadius: "20px",
          // backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          border: "2px solid white",
          padding: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Next
      </button>
    </div> : <div></div>
  );
};

export default Pagination;