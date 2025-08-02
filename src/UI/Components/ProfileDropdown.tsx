import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import { logout } from "../../services/operations/authApi";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const dispatch=useAppDispatch();
  const navigate=useNavigate();
  const [openMenue, setOpenMenue] = useState(false);
  const token = useAppSelector((state)=>state.auth.accessToken);

 function submitHandler(e: React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  dispatch(logout(token,navigate,dispatch));
 }


  return (
    <form onSubmit={submitHandler} >
 <div className="relative">
      <div
        onClick={() => setOpenMenue(true)}
        className="text-3xl bg-amber-50 rounded-full p-1 hover:cursor-pointer"
      >
        <CgProfile />
      </div>
        {openMenue && (
          <div onClick={() => setOpenMenue(false)} className="  absolute left-[-9px] bg-white border rounded-md  text-base">
            <button type="submit" className="p-1">Logout <span><IoLogOutOutline /></span></button>
          </div>
        )}
    </div>
    </form>
   
  );
}
