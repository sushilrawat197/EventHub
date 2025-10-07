import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { FiCalendar } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Inputbox from "./Inputbox";
import UploadProfileImage from "./uploadProfileImage";
import { useAppSelector } from "../../../../reducers/hooks";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAppDispatch } from "../../../../reducers/hooks";
import { updateUserDetails } from "../../../../services/operations/userApi";
import { ClipLoader } from "react-spinners";
import EditProfileEmail from "./EditProfileEmail";

export default function ProfileCard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const [showCalendar, setShowCalendar] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [profileDetailsLoading, setProfileDetailsLoading] =
    useState<boolean>(false);
  const [showNumber, setShowNumber] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);

  const loading = useAppSelector((state) => state.user.loading);

  interface FormData {
    mobile: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    address: string;
    avatarUrl: string;
  }

  const [formData, setFormData] = useState<FormData>({
    mobile: user?.mobile ?? "",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    dob: user?.dob ?? "",
    gender: user?.gender ?? "",
    address: user?.address ?? "",
    avatarUrl: "",
  });

  const calendarRef = useRef<HTMLDivElement>(null); // ref for calendar

  function changeHandler(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }


  function phoneChangeHandler(
  e: ChangeEvent<HTMLInputElement>,
  changeHandler: (e: ChangeEvent<HTMLInputElement>) => void
) {
  const onlyNums = e.target.value
    .replace(/[^0-9]/g, "")
    .slice(0, 10);

  changeHandler({
    ...e,
    target: { ...e.target, name: "mobile", value: onlyNums },
  } as ChangeEvent<HTMLInputElement>);
}



  function calendarChangeHandler(value: Date) {
    const day = String(value.getDate()).padStart(2, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const year = value.getFullYear();
    // 👈 new state

    setFormData((prev) => ({
      ...prev,
      dob: `${year}-${month}-${day}`, // ✅ YYYY-MM-DD
    }));

    setShowCalendar(false); // date select karte hi calendar close
  }



  // 📌 Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }

      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setEditImage(false);
      }
    }



    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);




  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isDisabled) return; // 👈 prevent rapid clicks
    setIsDisabled(true); // 👈 disable button
    console.log(formData);
    dispatch(updateUserDetails(formData, setProfileDetailsLoading));
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  }

  return (
    <form onSubmit={submitHandler}>

      {showNumber && <EditProfileEmail setShowNumber={setShowNumber} />}

      <div className="mx-auto max-w-4xl mt-24 lg:mt-28">
        <div className="bg-white rounded-3xl shadow-2xl relative overflow-hidden border border-gray-100">
          {editImage && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40" // tailwind shortcut for bg-opacity-40
                onClick={() => setEditImage(false)}
              ></div>
              <UploadProfileImage setEditImage={setEditImage} />
              {/* <UploadProfileImage setEditImage={setEditImage} /> */}
            </div>
          )}

          {showCalendar && (
            <div
              ref={calendarRef}
              className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Calendar
                onChange={(val) => calendarChangeHandler(val as Date)}
              />
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
            </div>
            
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-1">Hello, {user?.firstName}</h2>
                <p className="text-blue-100 text-sm">Manage your profile settings</p>
              </div>
              <div
                onClick={() => setEditImage(true)}
                className="hover:cursor-pointer hover:scale-105 transition-transform duration-300 w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex justify-center items-center border-2 border-white/30 shadow-xl"
              >
                <div className="relative w-12 h-12">
                  {/* Image or default icon */}
                  {user?.avatarUrl ? (
                    <img
                      src={user?.avatarUrl}
                      alt="Profile"
                      loading="lazy"
                      onLoad={() => setLoaded(true)}
                      className={`
                        rounded-2xl w-12 h-12 object-cover overflow-hidden
                        transition-all duration-500 ease-in-out
                        ${
                          loaded
                            ? "opacity-100 blur-0"
                            : "opacity-0 blur-md"
                        }
                      `}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/30">
                      <FaCamera size={18} />
                    </div>
                  )}

                  {/* Loader overlay */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-2xl">
                      <ClipLoader size={20} color="#ffffff" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 mx-auto p-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl">
                  <RiVerifiedBadgeFill size={20} />
                  <span className="font-medium">Verified</span>
                </div>
              </div>
            </div>

            {/* <div className="flex items-center lg:gap-16 gap-3 md:gap-16">
              <p className="text-sm text-black">Phone Number:</p>

              {user?.mobile ? (
                <div className=" pl-2 flex flex-wrap items-center text-black text-md gap-2">
                  <span className="font-semibold">{user?.mobile}</span>
                  <span className="flex items-center ml-4 text-green-700 gap-1 mt-1 sm:mt-0">
                    Edit <FaEdit size={18} />
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => setShowNumber(true)}
                  className="w-lg py-2 bg-amber-200 flex flex-col px-7 hover:cursor-pointer"
                >
                  <p className="text-red-500 text-lg">+ Add Mobile Number</p>
                  <p className="text-black text-md">
                    Get a copy of ticket on your Number
                  </p>
                </div>
              )}
            </div> */}
          </div>

          {/* Personal Details */}
          <div className="bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
            </div>
            <div className="space-y-6">
              <Inputbox
                id="mobile"
                label="Phone Number"
                placeholder="Enter your Phone number"
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={(e) => phoneChangeHandler(e, changeHandler)}
              />

              <Inputbox
                id="fname"
                label="First Name"
                placeholder="Enter first name"
                name="firstName"
                value={formData.firstName}
                onChange={changeHandler}
              />

              <Inputbox
                id="lname"
                label="Last Name"
                placeholder="Enter last name"
                name="lastName"
                value={formData.lastName}
                onChange={changeHandler}
              />
              {/* Birthday */}

              <Inputbox
                id="dob"
                label="Birthday"
                placeholder="dd-mm-yyyy"
                name="dob"
                type="text"
                value={formData.dob}
                onChange={changeHandler}
                onClick={() => setShowCalendar(true)} // 👈 open calendar
                icon={FiCalendar}
              />

              <Inputbox
                id="address"
                label="Address"
                placeholder="Enter you Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={changeHandler}
              />

              {/* Gender buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center text-gray-700 font-semibold text-lg sm:w-40">
                  Gender
                </label>
                <div className="flex gap-3">
                  {["MALE", "FEMALE"].map((genderOption) => (
                    <button
                      key={genderOption}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender: genderOption }))
                      }
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        formData.gender === genderOption
                          ? "bg-blue-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        formData.gender === genderOption ? "bg-white" : "bg-gray-400"
                      }`}></div>
                      {genderOption.charAt(0) + genderOption.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
            <div className="flex justify-center">
              {!profileDetailsLoading ? (
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-12 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 ${
                    isDisabled
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update Profile</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold px-12 py-4 rounded-2xl shadow-lg"
                >
                  <ClipLoader color="#ffffff" size={20} />
                  <span>Updating...</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
