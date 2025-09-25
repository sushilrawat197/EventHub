// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAppSelector } from "../../../reducers/hooks";
// import { eventPagination } from "../../../services/operations/paginationFetch";

// export default function EventsList(

// ) {
//   const [events, setEvents] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const eventsPageData = useAppSelector((state) => state.events.allEventsBySearch);
//  const {page,size,totalElements,totalPages,last}=eventsPageData


//   useEffect(() => {
//     eventPagination(page);
//   }, [page]);

  

//   return (
//     <div className="max-w-2xl p-4">

//       <ul className="space-y-3">
//         {events.map((event: any) => (
//           <li
//             key={event.id}
//             className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
//           >
//             {event.name}
//           </li>
//         ))}
//       </ul>

//       {/* Pagination Controls */}
//       <div className="flex items-center mt-6 space-x-2">
//         <button
//           disabled={page === 0}
//           onClick={() => setPage((prev) => prev - 1)}
//           className={`px-4 py-2 rounded-lg border transition ${
//             page === 0
//               ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//               : "bg-white hover:bg-blue-100 border-blue-400 text-blue-600"
//           }`}
//         >
//           ⬅ Prev
//         </button>

//         {/* Page Numbers */}
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i}
//             onClick={() => setPage(i)}
//             className={`w-10 h-10 rounded-full transition ${
//               i === page
//                 ? "bg-sky-500 text-white shadow"
//                 : "bg-gray-100 text-gray-700 hover:bg-blue-200"
//             }`}
//           >
//             {i + 1}
//           </button>
//         ))}

//         <button
//           disabled={page === totalPages - 1}
//           onClick={() => setPage((prev) => prev + 1)}
//           className={`px-4 py-2 rounded-lg border transition ${
//             page === totalPages - 1
//               ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//               : "bg-white hover:bg-blue-100 border-blue-400 text-blue-600"
//           }`}
//         >
//           Next ➡
//         </button>
//       </div>
//     </div>
//   );
// }
