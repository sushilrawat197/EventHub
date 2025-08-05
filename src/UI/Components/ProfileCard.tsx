import { useState } from "react";
import { FiEdit2, FiCalendar } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Inputbox from "./Inputbox";

export default function ProfileCard() {
  // 👇 States for input fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");

  return (
    <div className="h-screen mx-auto max-w-3xl rounded-t-lg  mt-24">
      <div className="bg-white shadow-lg">
        {/* Header Box */}
        <div className="bg-gradient-to-r from-sky-300 to-sky-500 text-white flex justify-between items-center px-5 py-5">
          <h2 className="text-3xl">Hi, Guest</h2>
          <div className="w-12 h-12 bg-white text-gray-600 rounded-full flex justify-center items-center">
            <FaCamera size={22} />
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white mx-auto p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-0">
            <div>
              <p className="text-sm text-black">Email Address:</p>
              
              <div className="flex flex-wrap items-center text-[#777777] text-[15px] mt-1">
                <span>vinit.panwar2003@gmail.com</span>
                <span className="flex items-center ml-4 text-green-700 gap-1 mt-1 sm:mt-0">
                  Verified <RiVerifiedBadgeFill size={18} />
                </span>
              </div>
            </div>
            <button className="text-sky-600 text-sm flex items-center gap-1 hover:underline mt-2 sm:mt-0">
              <FiEdit2 /> Edit
            </button>
          </div>

          <p className="text-sm text-blackfont-semibold">Mobile Number:</p>
        </div>

        {/* Personal Details */}
        <div className="bg-white p-6 shadow-md shadow-gray-100">
          <h2 className="text-lg font-semibold mb-6">Personal Details</h2>

          <div className="space-y-10">
            {/* First Name */}
            <Inputbox
              id="fname"
              label="First Name"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            {/* Last Name */}
            <Inputbox
              id="lname"
              label="Last Name"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            {/* Birthday */}
            <Inputbox
              id="dob"
              label="Birthday (Optional)"
              placeholder="dd-mm-yyyy"
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              icon={FiCalendar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
