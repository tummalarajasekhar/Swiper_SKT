import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination,Autoplay } from "swiper/modules"; // Import core Swiper classes
import './App.css'

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Axios for API calls
import axios from "axios";

const Slider = () => {
  const [images, setImages] = useState([]); // State to store images

  // Fetch images from the backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        setImages(response.data); // Update state with image data
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  // Initialize Swiper (Required if using custom HTML)
  

  return (
    <>
    <div className="slider-wrapper">
		<div className="slider">
    {
    images.map((image) => (
              <div className="swiper-slide" key={image._id}>
                <img
                  src={image.imageUrl}
                  alt={`Slide ${image._id}`}
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
              </div>
            ))}
		</div>
		<div className="slider-nav">
			<a href="#slide-1"></a>
			<a href="#slide-2"></a>
			<a href="#slide-3"></a>
		</div>
	</div>

    
   
    </>
  );
};

export default Slider;
