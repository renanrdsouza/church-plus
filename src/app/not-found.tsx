import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex h-[calc(100vh-76px)] flex-col gap-y-5 items-center justify-center">
      <h1 className="text-4xl font-semibold text-gray-800">
        Página não encontrada...
      </h1>
      <Link
        href="/"
        className="text-slate-500 hover:underline hover:scale-110 transition-all duration-300"
      >
        Voltar para a home
      </Link>
    </div>
  );
};

export default NotFound;
