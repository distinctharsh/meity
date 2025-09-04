"use client";
import Image from "next/image";
import AccessibilityBar from "./AccessibilityBar";
// no local state needed here; AccessibilityBar manages its own panel

export default function Header() {
    return (
        <>

            <header style={{borderBottom: '1px solid #e6e6e6'}}>
                <div style={{maxWidth: 1200, margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16}}>
                    {/* Left: Emblem + Text */}
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                        <Image src="/images/emblem.svg" alt="Government Emblem" width={56} height={56} priority />

                        <div style={{lineHeight: 1}}>
                            <div style={{fontSize: 14, color: '#4b4b4b'}}>Government of India</div>
                            <div style={{fontSize: 20, fontWeight: 700}}>Ministry of Electronics and Information Technology</div>
                        </div>
                    </div>

                    {/* Right: Search, Digital India logo, action icons */}
                    <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                        {/* Search box */}
                        <div style={{position: 'relative'}}>
                            <input aria-label="Search" placeholder="Search..." style={{padding: '10px 36px 10px 12px', border: 'none', borderBottom: '3px solid #123a6b', outline: 'none', borderRadius: 4, width: 300}} />
                            <button aria-label="Search button" style={{position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18}}>🔍</button>
                        </div>

                        {/* Digital India logo */}
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Image src="/images/digitalindia.svg" alt="Digital India" width={160} height={48} />
                        </div>

                        {/* Action icons (simple accessible buttons) */}
                        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                            <button title="Login" style={{background: 'transparent', border: 'none', cursor: 'pointer', padding: 6}}>
                                <svg width="32" height="32" aria-label="Skip to main Content icon" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.0335 5.69397H8.61686C8.04223 5.69397 7.49113 5.92224 7.0848 6.32857C6.67847 6.7349 6.4502 7.286 6.4502 7.86064V12.194H8.08324V7.19397H27.7002V23.694H8.06142V18.694H6.4502V23.0273C6.4502 23.6019 6.67847 24.153 7.0848 24.5594C7.49113 24.9657 8.04223 25.194 8.61686 25.194H27.0335C27.6082 25.194 28.1593 24.9657 28.5656 24.5594C28.9719 24.153 29.2002 23.6019 29.2002 23.0273V7.86064C29.2002 7.286 28.9719 6.7349 28.5656 6.32857C28.1593 5.92224 27.6082 5.69397 27.0335 5.69397ZM10.7835 18.694V16.5754H3.2002V14.694H10.7835V12.194L14.5 15.5L10.7835 18.694ZM24.8669 16H17.2835V14.3606H24.8669V16ZM24.8669 12.194H17.2835V10.694H24.8669V12.194ZM21.6169 20.194H17.2835V18.694H21.6169V20.194Z" fill="#1D0A69"></path></svg>
                            </button>
                            <button title="Language" style={{background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, fontWeight: 600}}>
                                <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.125 3.735V12H12.91V3.735H11.815V2.67H15.685V3.735H14.125ZM8.47 2.52C9.25 2.52 9.845 2.715 10.255 3.105C10.675 3.495 10.885 3.985 10.885 4.575C10.885 5.005 10.77 5.395 10.54 5.745C10.32 6.085 9.99 6.355 9.55 6.555C9.11 6.755 8.56 6.865 7.9 6.885L7.825 5.835C8.505 5.815 8.985 5.695 9.265 5.475C9.555 5.255 9.7 4.96 9.7 4.59C9.7 4.23 9.58 3.97 9.34 3.81C9.11 3.65 8.84 3.57 8.53 3.57C8.16 3.57 7.825 3.62 7.525 3.72C7.225 3.82 6.905 3.955 6.565 4.125L6.19 3.09C6.45 2.95 6.77 2.82 7.15 2.7C7.54 2.58 7.98 2.52 8.47 2.52ZM11.05 8.73C11.05 9.19 10.945 9.575 10.735 9.885C10.525 10.195 10.24 10.425 9.88 10.575C9.53 10.725 9.13 10.8 8.68 10.8C8.11 10.8 7.58 10.66 7.09 10.38C6.61 10.1 6.15 9.655 5.71 9.045C5.28 8.435 4.855 7.64 4.435 6.66L5.5 6.27C5.79 6.98 6.09 7.595 6.4 8.115C6.72 8.625 7.06 9.02 7.42 9.3C7.78 9.57 8.165 9.705 8.575 9.705C8.955 9.705 9.265 9.62 9.505 9.45C9.745 9.27 9.865 8.985 9.865 8.595C9.865 8.115 9.7 7.7 9.37 7.35C9.04 7 8.64 6.68 8.17 6.39L9.055 6.345L9.7 6.21C9.84 6.33 9.995 6.475 10.165 6.645C10.335 6.815 10.47 6.985 10.57 7.155L10.645 7.44C10.775 7.63 10.875 7.83 10.945 8.04C11.015 8.25 11.05 8.48 11.05 8.73ZM11.29 6.75C11.77 6.75 12.185 6.715 12.535 6.645C12.885 6.565 13.295 6.44 13.765 6.27V7.35C13.335 7.54 12.945 7.665 12.595 7.725C12.255 7.785 11.88 7.815 11.47 7.815C11.32 7.815 11.145 7.805 10.945 7.785C10.745 7.755 10.555 7.725 10.375 7.695C10.205 7.655 10.08 7.62 10 7.59L9.295 6.75L9.385 6.525C9.675 6.595 9.98 6.65 10.3 6.69C10.62 6.73 10.95 6.75 11.29 6.75Z" fill="#162F6A"></path><path d="M19.63 22L18.426 18.906H14.464L13.274 22H12L15.906 11.962H17.04L20.932 22H19.63ZM18.048 17.786L16.928 14.762C16.9 14.6873 16.8533 14.552 16.788 14.356C16.7227 14.16 16.6573 13.9593 16.592 13.754C16.536 13.5393 16.4893 13.376 16.452 13.264C16.3773 13.5533 16.298 13.838 16.214 14.118C16.1393 14.3887 16.074 14.6033 16.018 14.762L14.884 17.786H18.048Z" fill="#162F6A"></path></svg>
                            </button>
                            <AccessibilityBar />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
