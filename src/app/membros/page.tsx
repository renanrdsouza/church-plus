import Link from "next/link";
import Container from "../components/container";
import { IMember } from "@/models/modelsInterfaces";

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${baseUrl}/api/v1/members/`);
  const { members } = await response.json();

  return members;
}

const Membros = async () => {
  const members = await getData();

  return (
    <Container>
      <main className="flex flex-col justify-center p-3">
        <div className="flex gap-x-3 mt-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none"
              placeholder="Digite o nome do membro..."
              required
            />
          </div>
          <button className="p-3 bg-slate-500 rounded-md text-white text-base font-bold hover:bg-slate-300 hover:text-slate-600 transition-all duration-300">
            Procurar
          </button>
        </div>
        <Link
          href="/cadastrar-membro"
          className="p-3 my-4 rounded-md bg-slate-500 text-white text-base text-center font-bold hover:bg-slate-300 hover:text-slate-600 transition-all duration-300"
        >
          Cadastrar novo membro
        </Link>

        <ul role="list" className="divide-y px-10 divide-gray-300">
          {members.map((member: IMember) => (
            <li key={member.id} className="flex justify-between gap-x-20 py-5">
              <div className="flex min-w-0 gap-x-4">
                {/* <img
                  alt=""
                  src={member.imageUrl}
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                /> */}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {member.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-3 max-w-56 shrink-0 sm:flex sm:items-end">
                <Link
                  href="#"
                  className="text-sm leading-6 text-gray-900 p-3 bg-slate-400 rounded-md"
                >
                  Editar
                </Link>
                <button className="bg-red-400 p-3 rounded-md">Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </Container>
  );
};

export default Membros;
