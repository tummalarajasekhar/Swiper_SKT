import React, { useEffect, useState } from "react";
import axios from "axios";

const SwiperCards = () => {
  const [cards, setCards] = useState([]);

  // Fetch cards from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/posts") // Replace with your backend endpoint
      .then((response) => setCards(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Delete card
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/post/${id}`) // Backend delete endpoint
      .then(() => {
        // Update state to remove the deleted card
        setCards(cards.filter((card) => card._id !== id));
      })
      .catch((error) => console.error("Error deleting data:", error));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Swiper Cards
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            ></div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {card.title}
              </h2>
              <p className="text-gray-600">{card.description}</p>
              <button
                onClick={() => handleDelete(card._id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded shadow hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwiperCards;
