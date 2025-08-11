


interface EventType {
  image: string;
  promoted: boolean;
  date: string;
  title: string;
  venue: string;
  category: string;
  price: number;
}

interface EventCardProps {
  event: EventType;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="w-full  rounded-md shadow-md bg-white flex-shrink-0">
      {/* Image */}
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full aspect-[3/4] object-cover rounded-t-md"
        />
        {event.promoted && (
          <span className="absolute top-2 right-2 bg-red-500/50 text-white text-xs font-semibold px-2 py-1 rounded-md">
            PROMOTED
          </span>
        )}
      </div>

      {/* Date */}
      <div className="bg-black text-white text-[8px] px-2 py-1">
        {event.date}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-xs leading-tight">{event.title}</h3>
        <p className="text-xs text-gray-600">{event.venue}</p>
        <p className="text-xs text-gray-500">{event.category}</p>
        <p className="text-xs text-gray-800 font-medium">
          M - {event.price} onwards
        </p>
      </div>
    </div>
  );
}
