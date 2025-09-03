import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../reducers/hooks";
import { updateUserProfilPicture } from "../../../../services/operations/userApi";
import { GoPersonFill } from "react-icons/go";

type Props = {
  setEditImage: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UploadProfileImage({ setEditImage }: Props) {
  const user = useAppSelector((state) => state.user.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useAppDispatch();

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadHandler = () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    dispatch(updateUserProfilPicture(formData));
    setEditImage(false);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

      useEffect(() => {
    document.body.style.overflow = "hidden"; // disable scroll
    return () => {
      document.body.style.overflow = "auto"; // enable scroll again
    };
  }, []);


  return (
    <div className="bg-gradient-to-b from-white to-sky-50 shadow-lg border border-sky-100 flex flex-col items-center px-6 py-8 rounded-2xl gap-5 w-[280px] md:w-[320px] transition-transform duration-300 hover:scale-[1.02] z-50">
      {/* Profile Image with Hover Glow */}

      <div className="relative group">
        <div className="border-4 border-white rounded-full h-24 w-24 flex justify-center items-center overflow-hidden shadow-md transition-shadow duration-300 group-hover:shadow-sky-300/50">
          <button
            onClick={handleSelectClick}
            type="button"
            className="relative h-full w-full"
          >
            {/* Loader */}
            {!loaded && !previewUrl && user?.avatarUrl && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-200 animate-pulse z-50"></div>
            )}

            {/* Image */}
            {previewUrl ? (
              <img
                src={previewUrl}
                className="rounded-full h-full w-full object-cover animate-none"
              />
            ) : user?.avatarUrl ? (
              <img
                loading="lazy"
                onLoad={() => setLoaded(true)}
                src={user.avatarUrl}
                className={`
            rounded-full object-cover overflow-hidden h-full w-full
            transition-all duration-500 ease-in-out  
            ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}
          `}
              />
            ) : (
              <div className="animate-none flex items-center justify-center">
                <GoPersonFill className="text-sky-500 " size={40} />
              </div>
            )}
          </button>
        </div>

        {/* Edit Icon Overlay */}

        <div
          onClick={handleSelectClick}
          className="absolute z-50 bottom-0 right-0 bg-sky-500 text-white text-xs px-2 py-1 rounded-full shadow hover:bg-sky-600 transition-colors"
        >
          Edit
        </div>
      </div>

      {/* Text */}
      <p className="text-gray-700 font-semibold">Change Profile Picture</p>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={uploadHandler}
          type="button"
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          Save picture
        </button>

        {/* Delete Button */}
        <button
          type="button"
          className="bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          Delete Photo
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
