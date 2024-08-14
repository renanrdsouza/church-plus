import Link from "next/link";
import Container from "../components/container";
import { IMember } from "@/models/modelsInterfaces";

const people = [
  {
    name: "Leslie Alexander",
    email: "leslie.alexander@example.com",
    role: "Co-Founder / CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Michael Foster",
    email: "michael.foster@example.com",
    role: "Co-Founder / CTO",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Dries Vincent",
    email: "dries.vincent@example.com",
    role: "Business Relations",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    role: "Front-end Developer",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Courtney Henry",
    email: "courtney.henry@example.com",
    role: "Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: "3h ago",
    lastSeenDateTime: "2023-01-23T13:23Z",
  },
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    role: "Director of Product",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    lastSeen: null,
  },
];

const Membros = async () => {
  const baseUrl = "http://localhost:3000/api/v1";
  const response = await fetch(`${baseUrl}/members/`);
  const { members } = await response.json();
  console.log(members);

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
                {/* {person.lastSeen ? (
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Last seen{" "}
                    <time dateTime={person.lastSeenDateTime}>
                      {person.lastSeen}
                    </time>
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                  </div>
                )} */}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </Container>
  );
};

export default Membros;
