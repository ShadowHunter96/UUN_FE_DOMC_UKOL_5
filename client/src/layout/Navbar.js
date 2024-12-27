import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#007bff" }}>
      <div className="container">
        <NavLink className="navbar-brand text-white" to="/">
          Shopping List App
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/">
                {language === "cz" ? "Domů" : "Home"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/addUser">
                {language === "cz" ? "Přidat člena" : "Add Member"}
              </NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {/* Language Selector */}
            <select
              className="form-select me-3"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: "120px" }}
            >
              <option value="en">English</option>
              <option value="cz">Čeština</option>
            </select>

            {/* Theme Toggle Button */}
            <button
              className="btn btn-primary"
              onClick={toggleTheme}
              style={{
                backgroundColor: theme === "light" ? "#f8f9fa" : "#343a40",
                color: theme === "light" ? "#000000" : "#ffffff",
                border: "none",
              }}
            >
              {language === "cz"
                ? theme === "light"
                  ? "Tmavý"
                  : "Světlý"
                : theme === "light"
                ? "Dark"
                : "Light"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
