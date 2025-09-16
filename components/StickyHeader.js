"use client";
import Header from "./Header";
import Navbar from "./Navbar";

export default function StickyHeader() {
  return (
    <div className="sticky top-0 z-[1000]">
      <Header />
      <Navbar />
    </div>
  );
}
