import placeholder from "../images/place.png";

function TripCard({ trip, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#16172A] rounded-lg overflow-hidden shadow-md w-full flex flex-col cursor-pointer hover:shadow-lg transition"
    >
      <div className="aspect-[4/3] md:aspect-[4/3] flex-shrink-0">
        <img
          src={trip.coverImage ? `/covers/${trip.coverImage}.jpg` : placeholder}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white truncate">{trip.name}</h2>
        <p className="text-sm text-gray-400">
          {trip.startDate
            ? new Date(trip.startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "No Date"}
        </p>
      </div>
    </div>
  );
}


export default TripCard;
