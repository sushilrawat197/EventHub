import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function MobileFilters() {
  const filterSections = [
    {
      title: "Date",
      items: [
        { label: "Today" },
        { label: "Tomorrow" },
        { label: "This Weekend" },
        {
          label: "Date Range",
          right: (
            <span className="flex items-center text-red-500 text-[10px] ">
              Select Date <MdOutlineKeyboardArrowRight size={25} />
            </span>
          ),
        },
      ],
    },
    {
      title: "Languages",
      items: [{ label: "English" }],
    },
    {
      title: "Categories",
      items: [
        { label: "Kids Events" },
        { label: "Comedy Shows" },
        { label: "Festivals" },
        { label: "Music Concerts" },
        { label: "Cultural Events" },
        { label: "Sports Events" },
        { label: "Theater and Performing Arts" },
        { label: "Corporate Conferences and Workshops" },
      ],
    },
    {
      title: "Price",
      items: [
        { label: "Free" },
        { label: "0 - 500" },
        { label: "501 - 2000" },
        { label: "Above 2000" },
      ],
    },
  ];

  return (
    <div className="bg-white h-screen flex flex-col md:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <IoClose className="text-2xl cursor-pointer" />
        <h2 className="text-lg font-semibold">Filters</h2>
        <span className="w-6" />
      </div>

      {/* Scrollable  */}
      <div className="flex-1 overflow-y-auto  ">
        {filterSections.map((section, idx) => (
          <div key={idx} className="">
            {/*  Title */}
            <h3 className="bg-gray-200 text-[15px] font-semibold px-3 py-2">
              {section.title}
            </h3>

            {/*  Items */}
            <div className=" text-[12px]">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-3 flex justify-between items-center border-b border-gray-200 last:border-b-0"
                >
                  <span>{item.label}</span>
                  {item.right && item.right}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-gray-200 ">
        <button className="w-full py-2 bg-sky-500 text-white rounded-md font-extrabold ">
          Apply
        </button>
      </div>
    </div>
  );
}
