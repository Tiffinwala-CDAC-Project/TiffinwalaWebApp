import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { URL } from '../Constant';


export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    area: ""
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation checks
    const validationErrors = {};
    if (!credentials.name) {
      validationErrors.name = "Name is required.";
    }
    if (!credentials.email) {
      validationErrors.email = "Email is required.";
    } else if (!credentials.email.includes('@')) {
      validationErrors.email = "Invalid email format.";
    }
    if (!credentials.password) {
      validationErrors.password = "Password is required.";
    }
    if (!credentials.phone) {
      validationErrors.phone = "Phone number is required.";
    }
    if (!credentials.address) {
      validationErrors.address = "Address is required.";
    }
    if (!credentials.area) {
      validationErrors.area = "Please select an area.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear validation errors
    setErrors({});

    // Proceed with form submission
    const response = await fetch(`${URL}users/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'Application/json'
      },
      body: JSON.stringify({ ...credentials })
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      alert("Registered successfully.");
      // Redirect to the home page
      window.location.href = "/";
    }
  };

  const onChange = ({ target }) => {
    setCredentials({ ...credentials, [target.name]: target.value });
  };

  return (
    <>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} id="Email" aria-describedby="emailHelp" />
            {errors.email && <div className="text-danger">{errors.email}</div>}
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" name='password' value={credentials.password} onChange={onChange} id="Password" />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone number</label>
            <input type="number" className="form-control" name='phone' value={credentials.phone} onChange={onChange} />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" className="form-control" name='address' value={credentials.address} onChange={onChange} />
            {errors.address && <div className="text-danger">{errors.address}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="area" className="form-label">Area</label>
            <select name="area" id="area" value={credentials.area} onChange={onChange}>
              <option value="">Select an area</option>
              <option value="phase1">Phase1</option>
              <option value="phase2">Phase2</option>
              <option value="phase3">Phase3</option>
            </select>
            {errors.area && <div className="text-danger">{errors.area}</div>}
          </div>
          <button type="submit" className="m-3 btn btn-success">Signup</button>
          <Link to="/login" className='m-3 btn btn-secondary'>Login</Link>
        </form>
      </div>
    </>
  );
}


