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
                        <input type="text" placeholder="Search..." class="search-input" />
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
        </header>
    );
}