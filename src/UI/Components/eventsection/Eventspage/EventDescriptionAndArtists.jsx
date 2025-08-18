import React from "react";

export default function EventDescriptionAndArtists({
  description = "This is a sample event description. It provides an overview of the event, its purpose, and what attendees can expect.This is a sample event description. It provides an overview of the event, its purpose, and what attendees can expect  ",
  onReadMore = () => {},
  artists = ["Events.jpg"],
}) {
  return (
    <div className="w-full max-w-6xl mx-auto  space-y-4">
      {/* About Section */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-1">
          About The Event
        </h2>
        <p className="text-gray-700 leading-relaxed ">
          {description}
          <button
            onClick={onReadMore}
            className="text-sky-500 font-medium ml-1 hover:underline  cursor-pointer"
          >
            Read More
          </button>
        </p>
      </section>

      {/* Artists Section */}
      <section className="">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Artists</h2>
        <div className="grid grid-cols-0 sm:grid-cols-0 md:grid-cols-8 ">
          {artists.map((artist, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={artist.image || "Events1.jpg"}
                alt={artist.name}
                className="w-28 h-42 object-cover rounded-md shadow"
              />
              <p className="mt-2 font-medium">{artist.name} Sumit raj</p>
              <p className="text-sm text-gray-500">{artist.role} Movies </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
