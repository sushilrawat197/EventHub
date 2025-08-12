import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { updateUserProfilPicture } from "../../../services/operations/userApi";
import { GoPersonFill } from "react-icons/go";


type Props = {
  setEditImage: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UploadProfileImage({setEditImage}:Props) {

  const user = useAppSelector((state) => state.user.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  return (
    <div className="bg-gradient-to-b from-white to-sky-50 shadow-lg border border-sky-100 flex flex-col items-center px-6 py-8 rounded-2xl gap-5 w-[280px] md:w-[320px] transition-transform duration-300 hover:scale-[1.02] z-50">
      {/* Profile Image with Hover Glow */}
      <div className="relative group">
        <div className="border-4 border-white rounded-full h-24 w-24 flex justify-center items-center overflow-hidden shadow-md transition-shadow duration-300 group-hover:shadow-sky-300/50">
         <button onClick={handleSelectClick} type="button" className="h-full w-full">

          {previewUrl ? (
            <img
              src={previewUrl}
              className="rounded-full h-full w-full object-cover"
            />
          ) : user?.profilePicUrl ? (
            <img
              src={user.profilePicUrl}
              className="rounded-full h-full w-full object-cover"
            />
          ) : (
            <GoPersonFill className="text-sky-500" size={40} />
          )}
          
         </button>
          
        </div>

        {/* Edit Icon Overlay */}
        <div
          className="absolute bottom-0 right-0 bg-sky-500 text-white text-xs px-2 py-1 rounded-full shadow hover:bg-sky-600 transition-colors"
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
          Upload
        </button>

          {/* Delete Button */}
      <button type="button" className="bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
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
