// Card.jsx

import React from "react";

export default function Card({ title, price,description, imageUrl, onBuyClick }) {
  return (
    <div className="card" style={{ width: "18rem", maxHeight: "360px", marginRight: "100px" }}>
      <img
        className="card-img-top"
        src={imageUrl}
        alt="Card image cap"
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="d-inline h-100 fs-5">Price: {price}</div>
        <div >Description: {description}</div>
        <button className="btn btn-primary mt-3" onClick={onBuyClick}>Buy</button>
      </div>
    </div>
  );
}
