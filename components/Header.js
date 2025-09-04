"use client";
import Image from "next/image";
import AccessibilityBar from "./AccessibilityBar";
export default function Header() {
    return (
        <>
            <div className="container">
                <div className="row" style={{ display: "flex", flexDirection: "row" }}>
                    <div className="col">
                        <div className="logo" style={{ display: "flex", flexDirection: "row" }}>
                            <Image src="images/emblem.svg" alt="Logo" width={100} height={100} />
                            <div className="" >
                                <p className="mb-1 govtext h2">Government of India</p>
                                <h1 className="me-3 h2 text-break ministry-name-45 mb-0">Ministry of Electronics and Information Technology</h1></div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center gap-2 searchposition">
                            <div className="searchContainer">
                                <div className="input-group">
                                    <input type="search" role="searchbox" aria-label="search" className="form-control" placeholder="Search..." value="" />
                                    <button className="search-icon-btn skip" title="Search">
                                        <span className="material-symbols-outlined  bhashini-skip-translation ms-3" anuvadak-no-localization="true">search</span>
                                    </button>
                                </div>
                            </div>
                            <ul className="menutop px-0 d-flex align-items-center mt-3 mb-0"><li className="d-block d-lg-none"><span className="bhashini-skip-translation menu-icon material-symbols-outlined pointer" title="More Menu" role="navigation" tabindex="0">menu</span></li></ul>
                        </div>
                    </div>
                    <div className="col">

                    </div>
                    <div className="col">
                        <div className="accessibility">
                            <AccessibilityBar />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
