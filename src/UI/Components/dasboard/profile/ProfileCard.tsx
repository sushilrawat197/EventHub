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

      <div className=" mx-auto max-w-3xl mt-20 lg:mt-32">
        <div className="bg-white shadow-lg relative">
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
          <div className="bg-gradient-to-r rounded-t-xl from-sky-300 to-sky-500 text-white flex justify-between items-center px-5 py-5 ">
            <h2 className="text-3xl">Hello, {user?.firstName}</h2>
            <div
              onClick={() => setEditImage(true)}
              className="hover:cursor-pointer hover:opacity-70 w-16 h-16 bg-white text-gray-600 rounded-full flex justify-center items-center"
            >
              <div className="relative w-16 h-16">
                {/* Image or default icon */}
                {user?.avatarUrl ? (
                  <img
                    src={user?.avatarUrl}
                    alt="Profile"
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    className={`
                                rounded-full w-16 h-16 object-cover overflow-hidden
                                transition-all duration-500 ease-in-out
                                ${
                                  loaded
                                    ? "opacity-100 blur-0"
                                    : "opacity-0 blur-md"
                                }
                              `}
                  />
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200">
                    <FaCamera size={22} />
                  </div>
                )}

                {/* Loader overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
                    <ClipLoader size={20} color="#00BFFF" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white mx-auto p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-0">
              <div className="flex items-center lg:gap-16 md:gap-16">
                <p className="text-sm text-black">Email Address:</p>
                <div className="pl-4 flex flex-wrap items-center text-[#777777] text-md">
                  <span>{user?.email}</span>
                  <span className="flex items-center ml-4 text-green-700 gap-1 mt-1 sm:mt-0">
                    Verified <RiVerifiedBadgeFill size={18} />
                  </span>
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
          <div className="bg-white p-6 shadow-gray-100">
            <h2 className="text-xl font-semibold mb-6">Personal Details</h2>
            <div className="space-y-10">
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
              <div className="flex gap-4 mt-4 ">
                <p className="flex justify-center items-center text-gray-700 font-medium pr-24">
                  Gender
                </p>
                {["MALE", "FEMALE"].map((genderOption) => (
                  <button
                    key={genderOption}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, gender: genderOption }))
                    }
                    className={`px-5 py-2 rounded-lg font-semibold transition ${
                      formData.gender === genderOption
                        ? "bg-sky-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {genderOption.charAt(0) +
                      genderOption.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="w-full flex justify-center items-center mt-3 pb-8">
            {!profileDetailsLoading ? (
              <button
                type="submit"
                disabled={isDisabled}
                className={` w-48 bg-sky-500 hover:bg-sky-300 text-white font-semibold h-10 rounded-lg transition text-base ${
                  isDisabled
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                Update Details
              </button>
            ) : (
              <button
                disabled
                className="flex flex-col items-center justify-center w-48 bg-sky-200 text-white h-10 rounded-lg transition text-base cursor-not-allowed"
              >
                <ClipLoader color="#ffffff" size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
