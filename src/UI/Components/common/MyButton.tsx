
import { ClipLoader } from 'react-spinners'
import { useAppSelector } from '../../../reducers/hooks'


interface props {
    name:string,
    
}

export default function MyButton({name}:props) {

    const loading =useAppSelector((state)=>state.auth.loading);

  return (
    <div>

        {!loading ? (
              <button
                type="submit"
                className={`w-full bg-sky-500  p-2  text-white font-semibold h-10 rounded-sm transition text-base`}
              >
                {name}
              </button>
            ) : (
              <button
                disabled
                className="flex  flex-col items-center justify-center w-full bg-sky-300 text-white h-10 rounded-lg transition text-base cursor-not-allowed"
              >
                <ClipLoader color="#ffffff" size={20} />
              </button>
            )}

    </div>
     
  )
}
