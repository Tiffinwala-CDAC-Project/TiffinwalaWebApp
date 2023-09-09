import React, { useState, useEffect } from "react";
import image1 from "./one.png";
import image2 from "./two.png";
import image3 from "./three.png";

export default function Carousel() {
  const [slideIndex, setSlideIndex] = useState(0);

  const goToNextSlide = () => {
    setSlideIndex((prevSlideIndex) => (prevSlideIndex + 1) % 3);
  };

  const goToPrevSlide = () => {
    setSlideIndex((prevSlideIndex) => (prevSlideIndex + 2) % 3);
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        style={{ objectFit: "contain !important" }}
      >
        <div className="carousel-inner" id="carousel">
          <div className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}>
            <img
              src={image1}
              className="d-block w-100"
              style={{ filter: "brightness(100%)" }}
              alt="..."
            />
          </div>
          <div className={`carousel-item ${slideIndex === 1 ? "active" : ""}`}>
            <img
              src={image2}
              className="d-block w-100"
              style={{ filter: "brightness(100%)" }}
              alt="..."
            />
          </div>
          <div className={`carousel-item ${slideIndex === 2 ? "active" : ""}`}>
            <img
              src={image3}
              className="d-block w-100"
              style={{ filter: "brightness(100%)" }}
              alt="..."
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
          onClick={goToPrevSlide}
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
          onClick={goToNextSlide}
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
