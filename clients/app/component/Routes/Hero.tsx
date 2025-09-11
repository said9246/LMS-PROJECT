"use client";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { BiSearch } from "react-icons/bi";

// ✅ Static imports
import HeroBanner from "../../../public/assets/hero-banner-1.png";
import Client1 from "../../../public/assets/client-1.jpg";
import Client2 from "../../../public/assets/client-2.jpg";
import Client3 from "../../../public/assets/client-3.jpg";

const Hero: FC = () => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search === "") return;
    alert(`Search: ${search}`);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center bg-gray-700 px-6 py-22 gap-10 lg:gap-20">
      {/* Left Column - Image */}
      <div className="lg:w-1/2 flex items-center justify-center">
        <div className="p-6 bg-blue-900 rounded-[500px] flex items-center justify-center w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[500px] lg:h-[500px]">
          <Image
            src={HeroBanner}
            width={400}
            height={400}
            alt="Hero Banner"
            className="object-cover rounded-[20px]"
          />
        </div>
      </div>

      {/* Right Column - Text Content */}
      <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h2 className="text-white text-[25px] sm:text-[30px] lg:text-[60px] font-[600] leading-tight">
          Improve Your Online Learning Experience Better Instantly
        </h2>
        <p className="mt-4 sm:mt-6 text-gray-300 text-[16px] sm:text-[18px] font-[500]">
          We have 20K+ Online courses & 500k+ Online registered students. Find your desired course from them.
        </p>

        {/* Search Bar */}
        <div className="mt-6 sm:mt-8 w-full max-w-md h-[50px] bg-transparent relative">
          <input
            type="search"
            placeholder="Search Courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-[5px] p-2 w-full h-full outline-none text-white text-[16px] sm:text-[18px]"
          />
          <div
            className="absolute flex items-center justify-center w-[50px] h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px] cursor-pointer"
            onClick={handleSearch}
          >
            <BiSearch className="text-white" size={28} />
          </div>
        </div>

        {/* Clients Section */}
        <div className="mt-6 sm:mt-10 flex items-center flex-wrap lg:flex-nowrap gap-3 lg:gap-0">
          <Image
            src={Client1}
            alt="Client 1"
            className="rounded-full w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] object-cover"
          />
          <Image
            src={Client2}
            alt="Client 2"
            className="rounded-full -ml-2 sm:-ml-5 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] object-cover"
          />
          <Image
            src={Client3}
            alt="Client 3"
            className="rounded-full -ml-2 sm:-ml-5 w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] object-cover"
          />
          <p className="ml-0 sm:ml-4 text-gray-200 text-[16px] sm:text-[18px] font-[600] mt-2 lg:mt-0">
            500K+ People already trusted us.{" "}
            <Link href="/courses" className="text-[#46e256]">
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
