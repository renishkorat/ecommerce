import { FiLoader } from "react-icons/fi";

export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[250px]">
      <FiLoader className="animate-spin text-blue-600 text-4xl" />
    </div>
  );
}