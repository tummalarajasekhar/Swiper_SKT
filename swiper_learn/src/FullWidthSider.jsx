import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FullResponsiveSlider = () => {
  const [slides, setSlides] = useState([]);

  // Fetch slider data from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/posts") // Replace with your backend endpoint
      .then((response) => setSlides(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="w-full h-[60vh] bg-gray-100 py-8 flex justify-center items-center">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="w-full md:w-3/4 lg:w-2/3 h-full"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide._id} className="w-full h-full">
          <div className="relative w-full h-full">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 bg-black bg-opacity-50 text-white w-full p-4 text-center">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base lg:text-lg">{slide.description}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
  );
};

export default FullResponsiveSlider;
