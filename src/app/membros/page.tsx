"use client";
import Link from "next/link";
import Container from "../components/container";
import { useEffect, useState } from "react";
import { IMember } from "@/models/modelsInterfaces";
import Modal from "@/app/components/Modal";
import Loading from "./loading";

const Membros = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [members, setMembers] = useState<IMember[]>([]);
  const [open, setIsOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response = await fetch(`${baseUrl}/api/v1/members/`);
      const data = await response.json();
      setMembers(data.members);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDeleteItem = async (id: string) => {
    await fetch(`${baseUrl}/api/v1/members/${id}`, {
      method: "DELETE",
    });

    const filteredItems = members.filter((member) => member.id !== id);
    setMembers([...filteredItems]);
    setIsOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <main className="flex flex-col p-3 h-screen">
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
            <li key={member.id} className="flex justify-between gap-x-30 py-5">
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
              <div className="flex gap-x-1 sm:gap-x-3 max-w-56 shrink-0 sm:flex items-center sm:items-end">
                <Link
                  href={`/membros/${member.id}`}
                  className="p-2 sm:p-3 h-11 bg-slate-500 rounded-md text-white text-base hover:bg-slate-300 hover:text-slate-600 transition-all duration-300"
                >
                  Detalhes
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(true), setItemToDelete(member.id);
                  }}
                  className="bg-red-400 h-11 p-2 sm:p-3 text-center rounded-md hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Modal open={open} onClose={() => setIsOpen(false)}>
          <div className="text-center w-56">
            <div className="mx-auto my-4 w-48">
              <h3 className="text-lg font-black text-gray-800">
                Confirmar exclusão
              </h3>
              <p className="text-sm text-gray-500">
                Tem certeza que deseja deletar este item?
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteItem(itemToDelete)}
                className="shadow-md text-white rounded-md p-1 bg-red-400 w-full hover:scale-110 transition-all duration-200"
              >
                Sim
              </button>
              <button
                className="shadow-md bg-white rounded-md p-1 w-full hover:scale-110 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Não
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </Container>
  );
};

export default Membros;
