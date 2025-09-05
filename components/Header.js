"use client";
import Image from "next/image";
import AccessibilityBar from "./AccessibilityBar";
import Bhashini from "./icons/bhashini";
import Emblem from "./icons/Emblem";
import Skip from "./icons/skip";

export default function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <Emblem />
                    <div className="header-text">
                        <div className="gov-text">Government of India</div>
                        <h2 className="ministry-text">
                            Ministry of Electronics and Information Technology
                        </h2>
                    </div>

                    <div className="search-wrapper">
                        <input type="text" placeholder="Search..." className="search-input" />
                        <button className="search-btn" title="Search">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </div>
                </div>
                <div className="digital-india-logo">
                    <img src="./images/digitalindia.svg"></img>
                </div>

                <div className="header-right">
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
            <nav className="main-nav" role="navigation" aria-label="Main navigation">
                <ul className="nav-list">
                    <li className="nav-item active"><a href="#">Home</a></li>
                    <li className="nav-item"><a href="#">Ministry <span className="chev">▾</span></a></li>
                    <li className="nav-item"><a href="#">Offerings <span className="chev">▾</span></a></li>
                    <li className="nav-item has-dropdown">
                        <a href="#">Documents <span className="chev">▾</span></a>
                        <div className="dropdown" aria-hidden="true">
                            <div className="top"><a href="#">Reports</a></div>
                            <ul className="list">
                                <li><a href="#">Act and Policies</a></li>
                                <li><a href="#">Orders and Notices</a></li>
                                <li><a href="#">Publications</a></li>
                                <li><a href="#">Press Release</a></li>
                                <li><a href="#">Gazettes Notifications</a></li>
                                <li><a href="#">Guidelines</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item"><a href="#">Media <span className="chev">▾</span></a></li>
                    <li className="nav-item"><a href="#">Connect <span className="chev">▾</span></a></li>
                </ul>
            </nav>
        </header>
    );
}