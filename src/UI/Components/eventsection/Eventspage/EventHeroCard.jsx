import { FaShareAlt, FaThumbsUp } from "react-icons/fa";

export default function EventHeroCard({
  title = "Event Title",
  image = "Events1.jpg",
  tags = ["Stand Up Comedy", "Comedy Show"],
  interestedCount = 0,
  onShare = () => {},
  onInterestedClick = () => {},
}) {
  return (
    <div className=" max-w-6xl mx-auto ">
      {/* Title + Share */}
      <div className="flex items-center  ">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        {/* <button onClick={onShare} className=" ">
          <FaShareAlt size={18} />
        </button> */}
      </div>

      {/* Image */}
      <div className="  md:w-[60%] mt-2">
        <img src={image} alt={title} className="   rounded-xl object-cover" />
      </div>

      {/* Tags + Interested */}
      <div className="mt-1 flex flex-wrap justify-between items-center gap-3  ">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-sky-500 text-white text-sm px-3 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
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
