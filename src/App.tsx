import React from "react";
import { Outlet, Link } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <h1>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Debounced Search
          </Link>
        </h1>
        <nav>
          <Link to="/favorites">Favorites</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
};

export default App;
