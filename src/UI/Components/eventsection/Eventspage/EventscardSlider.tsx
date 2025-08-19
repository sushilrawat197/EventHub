import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


interface Event {
  title: string;
  image: string;
}

interface EventscardSliderProps {
  events: Event[];
}


export default function EventscardSlider({
  events = [],
}: EventscardSliderProps) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false,
        },
      },
    ],
  };

  return (

      <div className=" py-4 ">

      {/* Header */}
      <h2 className="text-xl font-bold">You May Also Like</h2>
      <p className="text-gray-600 mb-4">Events around you, book now</p>


      <div className="relative lg:ml-6 flex justify-center lg:block">

        <Slider {...settings} className="lg:w-3xl md:w-3xl w-96">

          {events.map((event, index) => (

            <div key={index} className="p-1">

              <div className="flex flex-col items-center bg-white  rounded-lg p-2">

                <div className="lg:h-60 lg:w-44 md:h-40 mt-2">

                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>

                <p className="mt-2 text-center w-30 text-sm">{event.title}</p>
                
              </div>
            </div>
          ))}


        </Slider>


        </div>



      </div>



    

  );
}
