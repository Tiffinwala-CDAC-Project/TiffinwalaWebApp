import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Card from "../components/Card";
import { useHistory } from "react-router-dom";
import Footer from '../components/Footer';
import './home.css'
import { URL } from '../Constant';

export default function Home() {
  const [meals, setMeals] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch(`${URL}mealist/meals/all`)
      .then(response => response.json())
      .then(data => setMeals(data))
      .catch(error => console.error("Error fetching meals:", error));
  }, []);

  const handleBuyClick = (meal) => {
    history.push({
      pathname: "/subscription",
      state: meal,
    });
  };

  return (
    <div>
     
      <Carousel />

      <div className="d-flex justify-content-center align-items-center m-3">
        {meals.map(meal => (
          <div key={meal.id}>
            <h2 className="mealsname">
              {meal.mealtype === "veg"
                ? "Veg Meals"
                : meal.mealtype === "nonveg"
                ? "Nonveg Meals"
                : "Hybrid Meals"}
            </h2>

            <Card
              title={meal.name}
              price={meal.price}
              imageUrl={meal.image_url}
              description={meal.description}
              onBuyClick={() => handleBuyClick(meal)}
            />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
