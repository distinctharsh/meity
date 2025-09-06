"use client";

export default function Navbar() {
    return (
        <nav className="main-nav" role="navigation" aria-label="Main navigation">
            <ul className="nav-list">
                <li className="nav-item active"><a href="#">Home</a></li>
                <li className="nav-item"><a href="#">Ministry <span className="chev">▾</span></a></li>
                <li className="nav-item"><a href="#">Offerings <span className="chev">▾</span></a></li>
                <li className="nav-item"><a href="#">Documents <span className="chev">▾</span></a></li>
                <li className="nav-item"><a href="#">Media <span className="chev">▾</span></a></li>
                <li className="nav-item has-dropdown">
                    <a href="#">Connect <span className="chev">▾</span></a>
                    <div className="dropdown" aria-hidden="true">
                        <ul className="dropdown-list">
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Directory</a></li>
                            <li><a href="#">RTI</a></li>
                            <li><a href="#">Grievance Redressal</a></li>
                            <li><a href="#">Visitor's Pass</a></li>
                            <li><a href="#">Citizen Engagement</a></li>
                            <li><a href="#">Parliament Questions</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
