import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './order.css';

// import Navbar from "../components/Navbar";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const userId = sessionStorage.getItem('loggedInUserId');

  // Function to format a date string to 'YYYY-MM-DD' format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!userId) {
      console.error('User ID not found in session storage.');
      return;
    }

    // Make the API request using Axios
    axios.get(`http://localhost:4000/orders/details/${userId}`)
      .then((response) => {
        const ordersData = response.data.data;
        setOrders(ordersData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // Handle the error gracefully, e.g., display an error message to the user.
      });
  }, [userId]);

  return (
    <>
    
    <div className="my-orders-container">
      <h1 className="text-center mb-4">My Orders</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <tbody>
            {orders.map((order, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td><strong>Subscription Name:</strong></td>
                  <td>{order.name}</td>
                </tr>
                <tr>
                  <td><strong>Subscription Description:</strong></td>
                  <td>{order.description}</td>
                </tr>
                <tr>
                  <td><strong>Selected Menu:</strong></td>
                  <td>{order.selectedMenu}</td>
                </tr>
                <tr>
                  <td><strong>Total Amount:</strong></td>
                  <td>Rs {order.totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Seleced Subscription:</strong></td>
                  <td>{order.selectedSubscription}</td>
                </tr>
                <tr>
                  <td><strong>Start Date:</strong></td>
                  <td>{formatDate(order.start_date)}</td>
                </tr>
                <tr>
                  <td><strong>End Date:</strong></td>
                  <td>{formatDate(order.end_date)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default MyOrders;
