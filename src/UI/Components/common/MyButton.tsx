import { ClipLoader } from "react-spinners";

interface Props {
  name: string;
  bgColor: string;
  onClick?: () => void;
  loading?: boolean; // now per button
}

export default function MyButton({ name, bgColor, onClick, loading = false }: Props) {
  return !loading ? (
    <button type="button" onClick={onClick} className={`w-full ${bgColor} p-2 text-white font-semibold h-10 rounded-sm transition text-base`}>
      {name}
    </button>
  ) : (
    <button type="button" disabled className="flex items-center justify-center w-full bg-sky-300 text-white h-10 rounded-lg transition text-base cursor-not-allowed">
      <ClipLoader color="#ffffff" size={20} />
    </button>
  );
}
