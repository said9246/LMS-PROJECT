"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CustomModal from "../utils/CustomModal";
import Login from "../component/Auth/Login";
import Signup from "../component/Auth/Signup";
import { CgProfile } from "react-icons/cg";
import Verification from "../component/Auth/Verification";
import { useSelector } from "react-redux";
  import avatar from "../../public/assets/Profile.png";

// Menu items
const menuItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/about" },
  { name: "About", href: "/about" },
  { name: "Policy", href: "/policy" },
  { name: "FAQ", href: "/faq" },
];

const Header = () => {
  const [open, setOpen] = useState(false); // Mobile menu
  const [modalOpen, setModalOpen] = useState(false); // Modal open/close
   const [route, setRoute] = useState<"Login" | "Sign-Up" | "Verification">("Login");
  
  
 
const { user } = useSelector((state: any) => state.auth);
const isLoggedIn = !!user;


  

  return (
    <header className="w-full bg-gray-800 text-white dark:bg-black shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-5 relative">
        {/* Logo */}
        <h1 className="text-xl font-bold">ELearning</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-10">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-white">
              {item.name}
            </Link>
          ))}

          {/* Profile / Login */}
          <div className="ml-auto">
            {isLoggedIn ? (
              <Link href="/profile">
                <Image
                   src={user?.avatar ? user.avatar : avatar}
                  alt="Profile"
                  width={35}
                  height={35}
                  className="rounded-full cursor-pointer"
                />
              </Link>
            ) : (
              <button
                onClick={() => {
                  setRoute("Login");
                  setModalOpen(true);
                }}
                className="focus:outline-none cursor-pointer"
              >
                <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-3">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="text-2xl cursor-pointer"
          >
            ☰
          </button>

          <div className="ml-auto">
            {isLoggedIn ? (
              <Link href="/profile">
                <Image
                        src={user?.avatar ? user.avatar : avatar}
                        alt="Profile"
                        width={35}
                        height={35}
                        className="rounded-full cursor-pointer"
                      />

              </Link>
            ) : (
              <button
                onClick={() => {
                  setRoute("Login");
                  setModalOpen(true);
                }}
                className="cursor-pointer"
              >
                <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white shadow-md z-50 flex items-center px-6">
            <ul className="flex flex-col items-center space-y-6 py-6 text-lg font-semibold">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white"
                    onClick={() => setOpen(false)}
                  >  
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal for Login / Signup */}
      {modalOpen && (
        <>
          {route === "Login" && (
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              component={Login}
              setRoute={setRoute}
            />
          )}

          {route === "Sign-Up" && (
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              component={Signup}
              setRoute={setRoute}
            />
          )}


          {route === "Verification" && (
            <CustomModal
              open={modalOpen}
              setOpen={setModalOpen}
              component={Verification}
              setRoute={setRoute}
            />
          )}
        </>
      )}
    </header>
  );
};

export default Header;
