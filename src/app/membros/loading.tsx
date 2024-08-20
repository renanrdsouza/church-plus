import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        <ArrowPathIcon />
      </div>
      <span className="text-2xl">Carregando...</span>
    </div>
  );
};

export default Loading;
