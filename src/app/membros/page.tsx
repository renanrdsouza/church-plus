"use client";
import Link from "next/link";
import Container from "../components/container";
import { useEffect, useState } from "react";
import { IMember } from "@/models/modelsInterfaces";

const Membros = () => {
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/v1/members/`);
      const data = await response.json();
      setMembers(data.members);
    };

    fetchData();
  }, []);

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
          {members.map((member) => (
            <li key={member.id} className="flex justify-between gap-x-20 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="flex flex-col justify-center min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {member.name}
                  </p>
                  <p className="hidden sm:block mt-1 truncate text-xs leading-5 text-gray-500">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-x-3 max-w-56 shrink-0 sm:flex sm:items-end">
                <Link
                  href="#"
                  className="p-2 sm:p-3 bg-slate-500 rounded-md text-white text-base hover:bg-slate-300 hover:text-slate-600 transition-all duration-300"
                >
                  Editar
                </Link>
                <button className="bg-red-400 p-2 sm:p-3 rounded-md hover:bg-red-600 hover:text-white transition-all duration-300">
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </Container>
  );
};

export default Membros;
