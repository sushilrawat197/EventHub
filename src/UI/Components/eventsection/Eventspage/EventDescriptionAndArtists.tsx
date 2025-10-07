// import { useState } from "react";

import { useState } from "react";

interface Artist {
  name: string;
  role: string;
  imageUrl: string | null;
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
    <div className="space-y-8">
      {/* About Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">About The Event</h2>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <p className="text-gray-700 leading-relaxed text-lg">
            {description.length > 150 && !readMe
              ? `${description.slice(0, 150)}... `
              : `${description} `}

            {/* Show button only if description is longer than 150 */}
            {description.length > 150 && (
              <button
                onClick={() => setReadme(!readMe)}
                className="ml-2 text-blue-600 font-semibold hover:text-blue-700 hover:underline cursor-pointer transition-colors"
              >
                {readMe ? "Show Less" : "Show More"}
              </button>
            )}
          </p>
        </div>
      </section>

      {/* Artists Section */}
      {artists && artists.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Artists</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {artists?.map((artist, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={artist.imageUrl ?? "/default.jpg"}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={artist.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{artist.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{artist.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
