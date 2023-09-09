import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './subscription.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useHistory,Link } from 'react-router-dom';
import axios from 'axios';
import Myorders from './Myorders'

export default function Subscription(props) {
  const { state } = props.location;
  const [meal, setMeal] = useState([]);
  const [subscription, setSubscription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const history = useHistory();
 const [daysRemaining, setDaysRemaining] = useState(null);
 const [subscriptionData, setSubscriptionData] = useState(null);
//current loggedin userID from session
  const userId = sessionStorage.getItem('loggedInUserId');
  

  useEffect(() => {
    
    axios.get(`http://localhost:4000/subscriptions/check/${userId}`)
      .then(response => {
        setIsSubscribed(response.data.subscribed);
      })
      .catch(error => {
        console.error('Failed to check subscription:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch the remaining days count for the user's subscription
    axios.get(`http://localhost:4000/subscriptions/${userId}`)
      .then(response => {
        setDaysRemaining(response.data.days_remaining);
      })
      .catch(error => {
        console.error('Failed to fetch remaining days:', error);
      });
  }, [userId]);


  useEffect(() => {
    if (subscription && state && state.price) {
      let multiplier = 1;
      if (subscription === 'weekly') {
        multiplier = 7; // Assuming 4 weeks in a month
      } else if (subscription === 'monthly') {
        multiplier = 30;
      } else if (subscription === 'quarterly') {
        multiplier = 90; // Assuming 3 months in a quarter
      }

      setTotalAmount(state.price * multiplier);
    }
  }, [subscription, state]);



  const handleSubscriptionChange = (event) => {
    const selectedSubscription = event.target.value;
    setSubscription(selectedSubscription);
    setShowEndDatePicker(false);
  };

  const handleStartDateChange = (event) => {
    const selectedStartDate = event.target.value;
    setStartDate(selectedStartDate);

    if (subscription === 'weekly') {
      const endDate = new Date(selectedStartDate);
      endDate.setDate(endDate.getDate() + 7);
      setEndDate(endDate.toISOString().split('T')[0]);
    } else if (subscription === 'monthly') {
      const endDate = new Date(selectedStartDate);
      endDate.setMonth(endDate.getMonth() + 1);
      setEndDate(endDate.toISOString().split('T')[0]);
    } else if (subscription === 'quarterly') {
      const endDate = new Date(selectedStartDate);
      endDate.setMonth(endDate.getMonth() + 3);
      setEndDate(endDate.toISOString().split('T')[0]);
    }

    setShowEndDatePicker(true);
  };

  const handleMealChange = (selectedMeal) => {
    if (meal.includes(selectedMeal)) {
      setMeal(meal.filter((m) => m !== selectedMeal));
    } else {
      setMeal([selectedMeal]);
    }
  };

  const areFieldsDisabled = meal.length === 0;

  const handleSubscribe = () => {
    if (subscription && startDate && endDate && meal.length > 0) {
      
      const newSubscriptionData = {
        name: meal[0],
        image_url: state.image_url,
        description: state.description,
        selectedSubscription: subscription,
        start_date: startDate,
        end_date: endDate,
        selectedMenu: state.mealtype,
        totalAmount: totalAmount,
         
      };
      setSubscriptionData(newSubscriptionData);
      const orderData = {
        userId: userId,
        
        totalAmount:totalAmount,
      };

      axios.post(`http://localhost:4000/orders/insert_order`, orderData)//orders table 
        .then(response => {
          console.log('Order created successfully:', response.data);
          // You can perform further actions like displaying a success message or redirecting
          // history.push('/'); // Navigate to home page
        })
        .catch(error => {
          console.error('Failed to create order:', error);
          // Handle error, show error message, etc.
        });

      // Replace 'YOUR_API_URL' with your actual API endpoint
      axios.post(`http://localhost:4000/subscriptions/${userId}`, subscriptionData)
        .then(response => {
          console.log('Subscription selected successfully:', response.data);
          // You can perform further actions like displaying a success message or redirecting
          console.log("subscription deatils",subscriptionData);
          history.push({
            pathname: '/myorders',
            state: { subscriptionData },
          });
        })
        .catch(error => {
          console.error('Failed to select subscription:', error);
          // Handle error, show error message, etc.
        });
    } else {
      console.log('Please fill in all required fields.');
    }
    
  };

  if (isSubscribed) {
    return (
      <div className="text-center mt-5">
        <div className="alert alert-success">
          <h2 className="mb-4">Congratulations!</h2>
          <p>You are already subscribed.</p>
          {daysRemaining !== null && (
            <p className="mt-3">
              Remaining Days: <span className="days-remaining">{daysRemaining}</span>
            </p>
          )}
          <p className="mt-3">
          <Link
  to={{
    pathname: '/myorders',
    state: { subscriptionData: subscriptionData }, // Pass your actual subscription data here
  }}
>
  Go to My Orders
</Link>
          </p>
        </div>
      </div>
    );
  }
  
  
else{
  return (
    <div>
    
      <div className="d-flex justify-content-center align-items-center m-3 mealmenu">
  <div className="d-flex align-items-center">
    <div className="subscription-image-container">
      {state ? (
        <img src={state.image_url} alt={state.name} className="subscription-image" />
      ) : (
        <div className="no-image">No Image Available</div>
      )}
    </div>
    
    <div className="meal-details">
      <h2>Subscription Details</h2>
      {state ? (
        <>
          <div className="meal-type">
            {state.mealtype === 'veg'
              ? 'Veg Meal'
              : state.mealtype === 'nonveg'
              ? 'Nonveg Meal'
              : 'Hybrid Meal'}
          </div>
          <div className="meal-name">Name: {state.name}</div>
          <div className="meal-price">Price: {state.price}</div>
          <div className="meal-desc">Description: {state.description}</div>
        </>
      ) : (
        <div>
          Please select a subscription <Link to="/">from the home page</Link>.
        </div>
      )}
    </div>
   
  </div>
</div>
      <div className="card container mt-5">
        <div className="card-body">
          {/* <h1 className="card-title text-center mb-4">Subscription Form</h1> */}
          <form>
            <div className="mb-3">
              <label className="form-label">Meal Name</label>
              <div className="d-flex">
                <div
                  className={`meal-label ${meal.includes('lunch') ? 'active' : ''}`}
                  onClick={() => handleMealChange('lunch')}
                >
                  Lunch
                </div>
                <div
                  className={`meal-label ${meal.includes('dinner') ? 'active' : ''}`}
                  onClick={() => handleMealChange('dinner')}
                >
                  Dinner
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="subscription" className="form-label">
                Subscription
              </label>
              <select
                id="subscription"
                className="form-select"
                value={subscription}
                onChange={handleSubscriptionChange}
                disabled={areFieldsDisabled}
              >
                <option value="">Select Subscription</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={handleStartDateChange}
                min={new Date().toISOString().split('T')[0]}
                disabled={areFieldsDisabled || !subscription}
              />
            </div>
            {showEndDatePicker && (
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  readOnly
                  disabled
                />
              </div>
            )}


             <div className="mb-3">
        <label className="form-label">Total Amount</label>
        <div>Rs {totalAmount.toFixed(2)}</div>
      </div>


            <button className="btn btn-primary" onClick={handleSubscribe} disabled={areFieldsDisabled}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
}


// ===================================================================================================

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './order.css';
import { useHistory } from 'react-router-dom';

export default function Myorders(props) {
  const { subscriptionData } = props.location.state;
  const userId = 12; // Temporary user ID

  const [subscriptionId, setSubscriptionId] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // Fetch the subscription ID for the user
    axios
      .get(`http://localhost:4000/subscriptions/checkAlreadySubscribeOrNot/${userId}`)
      .then(response => {
        console.log('Subscription check response:', response.data); // Add this line
        const subscriptionId = response.data.data[0]?.subscriptionId; // Use safe navigation operator
        if (subscriptionId) {
          setSubscriptionId(subscriptionId);
        } else {
          console.log('Subscription ID not available in response.');
        }
      })
      .catch(error => {
        console.error('Failed to check subscription:', error);
      });
  }, [userId]);

  const handleOrders = () => {
    if (subscriptionId) {
      const orderData = {
        userId: userId,
        subscriptionId: subscriptionId,
        totalAmount: subscriptionData.totalAmount,
      };

      // Create the order
      axios
        .post(`http://localhost:4000/orders/insert_order`, orderData)
        .then(response => {
          console.log('Order created successfully:', response.data);
          // You can perform further actions like displaying a success message or redirecting
          history.push('/'); // Navigate to home page
        })
        .catch(error => {
          console.error('Failed to create order:', error);
          // Handle error, show error message, etc.
        });
    } else {
      console.log('Subscription ID not available.');
    }
  };

  return (
    <div id='maindiv'>
      <h1>Order Confirmation</h1>
      <div>
      <img
  src={subscriptionData.image_url}
  alt={subscriptionData.name}
  className="subscription-image"
  onError={(e) => {
    e.target.style.display = 'none'; // Hide the image on error
    console.error('Error loading image:', e.target.src);
  }}
/>
<table className="order-table table table-bordered table-responsive">
          <tbody>
            <tr>
              <td className="table-label">Name:</td>
              <td>{subscriptionData.name}</td>
            </tr>
            
            <tr>
              <td className="table-label">Description:</td>
              <td>{subscriptionData.description}</td>
            </tr>
            <tr>
              <td className="table-label">Selected Subscription:</td>
              <td>{subscriptionData.selectedSubscription}</td>
            </tr>
            <tr>
              <td className="table-label">Start Date:</td>
              <td>{subscriptionData.start_date}</td>
            </tr>
            <tr>
              <td className="table-label">End Date:</td>
              <td>{subscriptionData.end_date}</td>
            </tr>
            <tr>
              <td className="table-label">Selected Menu:</td>
              <td>{subscriptionData.selectedMenu}</td>
            </tr>
            <tr>
              <td className="table-label">Total Amount:</td>
              <td>Rs {subscriptionData.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={handleOrders}>
          Confirm Order
        </button>
      </div>
    </div>
  );
}


// =============================================================================

import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './subscription.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useHistory,Link } from 'react-router-dom';
import axios from 'axios';
import Myorders from './Myorders'

export default function Subscription(props) {
  const { state } = props.location;
  const [meal, setMeal] = useState([]);
  const [subscription, setSubscription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const history = useHistory();
  const userId = sessionStorage.getItem('loggedInUserId');
  const [subscriptionId, setSubscriptionId] = useState(null);

  useEffect(() => {
    // Fetch the subscription ID for the user
    axios
      .get(`http://localhost:4000/subscriptions/checkAlreadySubscribeOrNot/${userId}`)
      .then(response => {
        console.log('Subscription check response:', response.data); // Add this line
        const subscriptionId = response.data.data[0]?.subscriptionId; // Use safe navigation operator
        if (subscriptionId) {
          setSubscriptionId(subscriptionId);
        } else {
          console.log('Subscription ID not available in response.');
        }
      })
      .catch(error => {
        console.error('Failed to check subscription:', error);
      });
  }, [userId]);

  useEffect(() => {
     // Temporary user ID
    // Replace 'YOUR_API_URL' with your actual API endpoint
    axios.get(`http://localhost:4000/subscriptions/check/${userId}`)
      .then(response => {
        setIsSubscribed(response.data.subscribed);
      })
      .catch(error => {
        console.error('Failed to check subscription:', error);
      });
  }, []);


  useEffect(() => {
    if (subscription && state && state.price) {
      let multiplier = 1;
      if (subscription === 'weekly') {
        multiplier = 7; // Assuming 4 weeks in a month
      } else if (subscription === 'monthly') {
        multiplier = 30;
      } else if (subscription === 'quarterly') {
        multiplier = 90; // Assuming 3 months in a quarter
      }

      setTotalAmount(state.price * multiplier);
    }
  }, [subscription, state]);



  const handleSubscriptionChange = (event) => {
    const selectedSubscription = event.target.value;
    setSubscription(selectedSubscription);
    setShowEndDatePicker(false);
  };

  const handleStartDateChange = (event) => {
    const selectedStartDate = event.target.value;
    setStartDate(selectedStartDate);

    if (subscription === 'weekly') {
      const endDate = new Date(selectedStartDate);
      endDate.setDate(endDate.getDate() + 7);
      setEndDate(endDate.toISOString().split('T')[0]);
    } else if (subscription === 'monthly') {
      const endDate = new Date(selectedStartDate);
      endDate.setMonth(endDate.getMonth() + 1);
      setEndDate(endDate.toISOString().split('T')[0]);
    } else if (subscription === 'quarterly') {
      const endDate = new Date(selectedStartDate);
      endDate.setMonth(endDate.getMonth() + 3);
      setEndDate(endDate.toISOString().split('T')[0]);
    }

    setShowEndDatePicker(true);
  };

  const handleMealChange = (selectedMeal) => {
    if (meal.includes(selectedMeal)) {
      setMeal(meal.filter((m) => m !== selectedMeal));
    } else {
      setMeal([selectedMeal]);
    }
  };

  const areFieldsDisabled = meal.length === 0;

  const handleSubscribe = () => {
    if (subscription && startDate && endDate && meal.length > 0) {
      // const userId = 10; // Temporary user ID
      const subscriptionData = {
        name: meal[0],
        image_url: state.image_url,
        description: state.description,
        selectedSubscription: subscription,
        start_date: startDate,
        end_date: endDate,
        selectedMenu: state.mealtype,// Assuming only one meal can be selected
        totalAmount: totalAmount,
         
      };

      const orderData = {
        userId: userId,
        subscriptionId:subscriptionId,
        totalAmount:totalAmount,
      };

      axios.post(`http://localhost:4000/orders/insert_order`, orderData)//orders table 
        .then(response => {
          console.log('Order created successfully:', response.data);
          // You can perform further actions like displaying a success message or redirecting
          // history.push('/'); // Navigate to home page
        })
        .catch(error => {
          console.error('Failed to create order:', error);
          // Handle error, show error message, etc.
        });

      // Replace 'YOUR_API_URL' with your actual API endpoint
      axios.post(`http://localhost:4000/subscriptions/${userId}`, subscriptionData)
        .then(response => {
          console.log('Subscription selected successfully:', response.data);
          // You can perform further actions like displaying a success message or redirecting
          console.log("subscription deatils",subscriptionData);
          history.push({
            pathname: '/myorders',
            state: { subscriptionData },
          });
        })
        .catch(error => {
          console.error('Failed to select subscription:', error);
          // Handle error, show error message, etc.
        });
    } else {
      console.log('Please fill in all required fields.');
    }    
  };

 
  return (
    <div>
      
      <div className="d-flex justify-content-center align-items-center m-3">
  <div className="d-flex align-items-center">
    <div className="subscription-image-container">
      {state ? (
        <img src={state.image_url} alt={state.name} className="subscription-image" />
      ) : (
        <div className="no-image">No Image Available</div>
      )}
    </div>
    
    <div className="meal-details">
      <h2>Subscription Details</h2>
      {state ? (
        <>
          <div className="meal-type">
            {state.mealtype === 'veg'
              ? 'Veg Meal'
              : state.mealtype === 'nonveg'
              ? 'Nonveg Meal'
              : 'Hybrid Meal'}
          </div>
          <div className="meal-name">Name: {state.name}</div>
          <div className="meal-price">Price: {state.price}</div>
          <div className="meal-desc">Description: {state.description}</div>
        </>
      ) : (
        <div>
          Please select a subscription <Link to="/">from the home page</Link>.
        </div>
      )}
    </div>
   
  </div>
</div>
      <div className="card container mt-5">
        <div className="card-body">
          {/* <h1 className="card-title text-center mb-4">Subscription Form</h1> */}
          <form>
            <div className="mb-3">
              <label className="form-label">Meal Name</label>
              <div className="d-flex">
                <div
                  className={`meal-label ${meal.includes('lunch') ? 'active' : ''}`}
                  onClick={() => handleMealChange('lunch')}
                >
                  Lunch
                </div>
                <div
                  className={`meal-label ${meal.includes('dinner') ? 'active' : ''}`}
                  onClick={() => handleMealChange('dinner')}
                >
                  Dinner
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="subscription" className="form-label">
                Subscription
              </label>
              <select
                id="subscription"
                className="form-select"
                value={subscription}
                onChange={handleSubscriptionChange}
                disabled={areFieldsDisabled}
              >
                <option value="">Select Subscription</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={handleStartDateChange}
                min={new Date().toISOString().split('T')[0]}
                disabled={areFieldsDisabled || !subscription}
              />
            </div>
            {showEndDatePicker && (
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  readOnly
                  disabled
                />
              </div>
            )}


             <div className="mb-3">
        <label className="form-label">Total Amount</label>
        <div>Rs {totalAmount.toFixed(2)}</div>
      </div>


            <button className="btn btn-primary" onClick={handleSubscribe} disabled={areFieldsDisabled}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

