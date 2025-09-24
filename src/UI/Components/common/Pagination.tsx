// import { ChevronsLeft, ChevronsRight } from "lucide-react";
// // import PaginationLoader from "./PaginationLoader";

// type PaginationProps = {
//   isLoading: boolean;
//   currentPage: number; // 0-based index
//   totalPages: number; // total pages (e.g. 1000)
//   totalElements: number;
//   onPageChange: (page: number) => void; // accepts 0-based index
// };

// const Pagination = ({
//   isLoading,
//   currentPage,
//   totalPages,
//   totalElements,
//   onPageChange,
// }: PaginationProps) => {
//   const pageRange = 2; // show ±2 pages around current
//   const pagesToShow: (number | "...")[] = [];

//   const currentDisplayPage = totalPages !== 0 ? currentPage + 1 : 0;

//   if (totalPages <= 7) {
//     for (let i = 1; i <= totalPages; i++) pagesToShow.push(i);
//   } else {
//     pagesToShow.push(1);

//     if (currentDisplayPage > pageRange + 2) {
//       pagesToShow.push("...");
//     }

//     const startPage = Math.max(2, currentDisplayPage - pageRange);
//     const endPage = Math.min(totalPages - 1, currentDisplayPage + pageRange);

//     for (let i = startPage; i <= endPage; i++) {
//       pagesToShow.push(i);
//     }

//     if (currentDisplayPage < totalPages - pageRange - 1) {
//       pagesToShow.push("...");
//     }

//     pagesToShow.push(totalPages);
//   }

// //   if (isLoading) return <PaginationLoader />;

//   return (
//     <div className="flex items-center justify-between px-2 py-1 bg-brand-secondary rounded-b-sm w-full bg-sky-500 my-3">
//       <div className="space-x-3">
//         {" "}
//         <span className="font-medium text-primary-bg">
//           Page {currentDisplayPage} of {totalPages}
//         </span>
//         <span className="font-medium text-primary-bg">
//           Total records: {totalElements}
//         </span>
//       </div>

//       <div className="flex items-center gap-1">
//         <button
//           className="rounded hover:bg-primary-bg"
//           title="Previous Page"
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 0}
//         >
//           <ChevronsLeft
//             size={16}
//             className="text-brand-primary hover:text-brand-secondary"
//           />
//         </button>

//         {pagesToShow.map((page, i) =>
//           page === "..." ? (
          
//             <span key={i} className="px-2 text-primary-bg">
//               ...
//             </span>
//           ) : (
//             <button
//               key={i}
//               className={`px-3 rounded  ${
//                 currentDisplayPage === page
//                   ? "bg-primary-bg text-brand-secondary"
//                   : "text-primary-bg hover:bg-primary-bg hover:text-brand-secondary"
//               }`}
//               onClick={() => onPageChange(page - 1)}
//             >
//               {page}
//             </button>
//           )
//         )}

//         <button
//           className="rounded hover:bg-primary-bg"
//           title="Next Page"
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages - 1}
//         >
//           <ChevronsRight
//             size={16}
//             className=" text-brand-primary hover:text-brand-secondary"
//           />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;