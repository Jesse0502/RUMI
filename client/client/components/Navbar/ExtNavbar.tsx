import React from "react";
import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import PWADownloadBtn from "../common/PWADownloadBtn";

export default function ExtNavbar() {
  return (
    <header className="bg-white border-b border-gray-100 px-3">
      <div className="content-width py-4 flex items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <PWADownloadBtn />
          <Link to="/onboarding" className="btn-primary px-4 py-2 text-sm">
            Get started
          </Link>
        </nav>

        {/* Mobile actions: show only Install + Get started (no menu) */}
        <div className="flex md:hidden items-center gap-3">
          <PWADownloadBtn />
          {/* <Link
            to="/onboarding"
            className="inline-flex items-center justify-center rounded-md bg-rumi-purple px-3 py-2 text-white text-sm"
          >
            Get started
          </Link> */}
        </div>
      </div>
    </header>
  );
}
