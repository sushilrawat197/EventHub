
// import { GoPersonFill } from "react-icons/go";
import { ImCross } from "react-icons/im";
import { MdOutlineAttachEmail } from "react-icons/md";


type Props = {
  setEditEmail: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditProfileEmail({ setEditEmail }: Props) {



  return (
    <div className="absolute top-[50%] duration-200 left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] flex z-50 p-12 font-bold rounded-md gap-5">
     
      <span
        onClick={() => setEditEmail(false)}
        className="absolute top-[-7px] right-[-6px] rounded-full cursor-pointer"
      >
        <ImCross className="text-red-500 text-[20px]" />
      </span>


      <div className="flex flex-col items-center justify-center gap-5">
        
        <p>Change Email</p>
        <div className="flex gap-4">

            <div className="flex justify-center items-center gap-3">
                <MdOutlineAttachEmail className="font-thin" size={30}/>
                 <input className="border rounded-md" type="email border"></input>  
            </div>

       
        </div>

           <button
            type="button"
            className="bg-sky-500 text-white w-24 p-2 rounded-sm"
          >
            submit
          </button>
      </div>

      {/* Hidden file input */}
    </div>
  );
}

