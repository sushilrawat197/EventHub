interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // console.log(currentPage, totalPages, onPageChange);

  function nextHandler() {
    console.log("Next Clicked..")
    onPageChange(currentPage + 1);

  }
  function backHandler() {
    console.log("Back Clicked..")
    onPageChange(currentPage - 1);
  }
  
  return (
    <div className="flex items-center justify-center gap-2 mt-6 bg-sky-400 py-3">
      <button
        onClick={backHandler}
        disabled={currentPage === 0}
        className="px-3 py-1 rounded bg-gray-200 disabled:cursor-not-allowed disabled: hover:cursor-pointer"
      >
        Prev
      </button>


      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded ${
            i === currentPage ? "bg-sky-500 text-white" : "bg-gray-100 "
          }`}
        >
          {i + 1}
        </button>
      ))}


      <button
        onClick={nextHandler}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:cursor-not-allowed hover:cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
