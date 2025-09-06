"use client";
import AccessibilityBar from "./AccessibilityBar";
import Bhashini from "./icons/Bhashini";
import Emblem from "./icons/Emblem";
import Skip from "./icons/Skip";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="row header-row">
          {/* Left Column */}
          <div className="col header-left">
            {/* Emblem */}
            <div className="emblem-col">
              <Emblem />
            </div>

            {/* Text */}
            <div className="header-text">
              <div className="gov-text">Government of India</div>
              <h2 className="ministry-text">
                Ministry of Electronics and Information Technology
              </h2>
            </div>

            {/* Search */}
            <div className="search-col">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
                <button className="search-btn" title="Search">
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="col digital-india-logo">
            <img src="./images/digitalindia.svg" alt="Digital India" />
          </div>

          {/* Right Column */}
          <div className="col header-right">
            <div className="action-icons">
              <button className="action-btn" title="Login">
                <Skip />
              </button>
              <button className="action-btn" title="Language">
                <Bhashini />
              </button>
              <AccessibilityBar />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
