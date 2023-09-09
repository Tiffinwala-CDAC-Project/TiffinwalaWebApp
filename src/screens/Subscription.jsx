import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './subscription.css';
import Footer from '../components/Footer';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../Constant';

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
  const [selectedMeals, setSelectedMeals] = useState([]);
  // Current logged-in userID from session
  const userId = sessionStorage.getItem('loggedInUserId');

  useEffect(() => {
    axios
      .get(`${URL}subscriptions/check/${userId}`)
      .then((response) => {
        setIsSubscribed(response.data.subscribed);
      })
      .catch((error) => {
        console.error('Failed to check subscription:', error);
      });
  }, [userId]);

  useEffect(() => {
    // Fetch the remaining days count for the user's subscription
    axios
      .get(`${URL}subscriptions/${userId}`)
      .then((response) => {
        setDaysRemaining(response.data.days_remaining);
      })
      .catch((error) => {
        console.error('Failed to fetch remaining days:', error);
      });
  }, [userId]);

  useEffect(() => {
    let mealMultiplier = 1;
    if (selectedMeals.includes('lunch/dinner')) {
      mealMultiplier = 2; // Double the amount if "lunch/dinner" is selected
    }

    if (subscription && state && state.price) {
      let multiplier = 1;
      if (subscription === 'weekly') {
        multiplier = 7; // Assuming 4 weeks in a month
      } else if (subscription === 'monthly') {
        multiplier = 30;
      } else if (subscription === 'quarterly') {
        multiplier = 90; // Assuming 3 months in a quarter
      }

      setTotalAmount(state.price * multiplier * mealMultiplier);
    }
  }, [subscription, state,selectedMeals]);

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
      setMeal([...meal, selectedMeal]);
    }
  };

  const areFieldsDisabled = meal.length === 0;

  const handleSubscribe = () => {
    console.log('handleSubscribe called');
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

      // Step 1: Insert data into the 'subscriptions' table
      axios
        .post(`${URL}subscriptions/${userId}`, newSubscriptionData)
        .then((subscriptionResponse) => {
          console.log('Subscription created successfully:', subscriptionResponse.data);

          // Step 2: Fetch the subscription ID from the response
          const subscriptionId = subscriptionResponse.data.subscriptionId;
          console.log("id:",subscriptionId);

          // Step 3: Insert data into the 'orders' table using the subscription ID
          const orderData = {
            userId: userId,
            subscriptionId: subscriptionId,
            totalAmount: totalAmount,
          };

          axios
            .post(`${URL}orders/insert_order`, orderData)
            .then((orderResponse) => {
              alert("Order Confirmed")
              console.log('Order created successfully:', orderResponse.data);
              toast.success('Your order is confirmed', {
                position: 'top-right',
                autoClose: 3000, // 3 seconds
              });

              // You can perform further actions like displaying a success message or redirecting
              console.log('subscription details', newSubscriptionData);
              history.push({
                pathname: '/myorders',
                state: { subscriptionData: newSubscriptionData },
              });
            })
            .catch((orderError) => {
              console.error('Failed to create order:', orderError);
              // Handle error, show error message, etc.
            });
        })
        .catch((subscriptionError) => {
          console.error('Failed to create subscription:', subscriptionError);
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
          <p>You are subscribed.</p>
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
  } else {
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
            <ToastContainer />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
