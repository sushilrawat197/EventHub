// import { useState } from "react";

import { useState } from "react";

interface Artist {
  name: string;
  role: string;
  image: string;
}

interface EventDescriptionAndArtistsProps {
  description?: string;
  onReadMore?: () => void;
  artists?: Artist[];
}
export default function EventDescriptionAndArtists({
  description = "",
  artists = [],
}: EventDescriptionAndArtistsProps) {
  const [readMe, setReadme] = useState(false);
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 pb-7">
      {/* About Section */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-1">
          About The Event
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {description.length > 150 && !readMe
            ? `${description.slice(0, 150)}... `
            : `${description} `}

          {/* Show button only if description is longer than 150 */}
          {description.length > 150 && (
            <button
              onClick={() => setReadme(!readMe)} 
              className="ml-2 text-sky-500 font-medium hover:underline cursor-pointer"
            >
              {readMe ? "Show Less" : "Show More"}
            </button>
          )}
        </p>
      </section>


      {/* Artists Section */}
      <section>
        <h2 className="text-lg md:text-xl font-semibold mb-4">Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-4">
          {artists.map((artist, index) => (
            <div key={index} className="w-28 h-42 ">
              <img
                src={artist.image}
                className="object-cover rounded-md shadow w-full h-full"
                alt={artist.name}
              />
              <p className="mt-2 font-medium text-left">{artist.name}</p>
              <p className="text-sm text-gray-500">{artist.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
