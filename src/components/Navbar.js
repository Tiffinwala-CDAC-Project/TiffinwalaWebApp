import React from 'react';
import { Link,useHistory } from 'react-router-dom';

export default function Navbar() {
  const loggedInUserId = sessionStorage.getItem('loggedInUserId');
  const history = useHistory(); // Use the useNavigate hook

  const handleLogout = () => {
    // Clear the session storage
    console.log('Logging out...');
    sessionStorage.removeItem('loggedInUserId');
    // Navigate to the login page
    // history.push('/');
    window.location.href = '/';
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-grey">
        <div className="container-fluid">
          <Link className="navbar-brand fs-1 fst-italic" to="/">Tiffinwala</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/subscription">Subscription</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/myorders">My Orders</Link>
              </li>
              {loggedInUserId ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">SignUp</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
