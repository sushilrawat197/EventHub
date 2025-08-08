import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../reducers/hooks";
import { setMassage } from "../slices/authSlice";
import { ImCross } from "react-icons/im";

export default function PopUpMessage() {
  const dispatch = useAppDispatch();
  const massage = useAppSelector((state) => state.auth.massage);
  const [hidden, setHidden] = useState(false);

  const clickHandler = () => {
    setHidden(true);
    dispatch(setMassage(null));
  };

  // Reset hidden whenever massage changes
  useEffect(() => {
    if (massage) {
      setHidden(false);
    }
  }, [massage]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(setMassage(null));
    };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  }, []);

  return (
    <>
      {!hidden && massage && (
        <p className="bg-red-400 opacity-80 text-sm text-white py-3 px-4 rounded-sm relative hover:cursor-pointer text-center">
          {massage}
          <span
            onClick={clickHandler}
            className="absolute top-[-4px] right-[-3px] rounded-full"
          >
            <ImCross className="text-black text-[9px] font-extrabold" />
          </span>
        </p>
      )}
    </>
  );
}
