import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });

    const json = await response.json();

    if (json.status === 'success' && json.data) {
      alert('Login Succesfull')
      toast.success('Login successful.', {
        position: 'top-right', // You can customize the position
        autoClose: 3000, // Notification will close after 3 seconds
      });
     
      // Store the logged-in userID in session storage
      sessionStorage.setItem('loggedInUserId', json.data);

      // Redirect to the home page
      window.location.href = '/';
    } else {
      alert('Invalid credentials. Please try again.');
      setCredentials({ ...credentials, password: '' });
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" name="email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
        </div>
        <button type="submit" className="m-3 btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default Login;
