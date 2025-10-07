// import { FaShareAlt, FaThumbsUp } from "react-icons/fa";

interface EventHeroCardDetails {
  title: string;
  image: string | null;
  tags: string; 

  // ✅ instead of Array
  // interestedCount: number;
  // onShare: () => void;
  // onInterestedClick: () => void;
}


export default function EventHeroCard({title,image,tags}:EventHeroCardDetails) {
  
  return (
    <div className="relative">
      {/* Hero Image - Increased Height */}
      <div className="relative h-96 lg:h-[28rem] overflow-hidden">
        {image && (
          <img 
            src={image} 
            alt="Event Poster" 
            className="w-full h-full object-cover" 
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Genre Badge - Bottom Left */}
        <div className="absolute bottom-4 left-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-2 text-white text-sm font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{tags}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
