import { GoPersonFill } from "react-icons/go";
import { ImCross } from "react-icons/im";
import { useRef } from "react";

type Props = {
  setEditImage: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UploadProfileImage({ setEditImage }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectClick = () => {
    fileInputRef.current?.click(); // Programmatically trigger file input click
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      // 👇 You can now upload the file or preview it, etc.
    }
  };

  return (
    <div className="absolute top-[50%] duration-200 left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] flex z-50 p-12 font-bold rounded-md gap-5">
      <div className="border rounded-full p-6">
        <GoPersonFill size={25} />
      </div>

      <span
        onClick={() => setEditImage(false)}
        className="absolute top-[-7px] right-[-6px] rounded-full cursor-pointer"
      >
        <ImCross className="text-red-500 text-[20px]" />
      </span>

      <div className="flex flex-col gap-2">
        <p>Change Profile Picture</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectClick}
            className="bg-sky-500 text-white w-24 p-2 rounded-sm"
          >
            Select
          </button>
          <button
            type="button"
            className="bg-sky-500 text-white w-24 p-2 rounded-sm"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Hidden file input */}
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
