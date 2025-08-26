// import { FaShareAlt, FaThumbsUp } from "react-icons/fa";

interface EventHeroCardDetails {
  title: string;
  image: string;
  tags: string; 

  // ✅ instead of Array
  // interestedCount: number;
  // onShare: () => void;
  // onInterestedClick: () => void;

}

export default function EventHeroCard({title,image,tags}:EventHeroCardDetails) {
  
  return (
    
    <div className=" max-w-6xl mx-auto ">
      {/* Title + Share */}
      <div className="flex items-center  ">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        {/* <button onClick={onShare} className=" ">
          <FaShareAlt size={18} />
        </button> */}
      </div>

      {/* Image Section */}
      <div className="w-full  mt-2">
        <div className="aspect-[18/9] w-full rounded-xl overflow-hidden shadow-md">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Tags + Interested */}
      <div className="mt-1 flex flex-wrap justify-between items-center gap-3  ">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
         

            <span
          
              className="bg-sky-500 text-white text-sm px-3 py-1 rounded-md"
            >

              {tags}
            </span>
       
        </div>

        {/* Interested */}
        {/* <div className="flex items-center gap-3">
          <span className="flex items-center text-green-600 font-medium">
            <FaThumbsUp className="mr-1" /> {interestedCount} are interested
          </span>
          <button
            onClick={onInterestedClick}
            className="border border-red-400 text-red-500 px-4 py-1 rounded-md hover:bg-red-50 transition"
          >
            I'm Interested
          </button>
        </div> */}
      </div>
    </div>
  );
}
