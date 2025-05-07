import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="side-nav">
        <h1>Trainer App</h1>
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Home
          </NavLink>
          <NavLink
            to="/Customerlist"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Customers
          </NavLink>
          <NavLink
            to="/Traininglist"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Trainings
          </NavLink>
          <NavLink
            to="/Calendar"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Calendar
          </NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
