"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  UserIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Example() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { data, status } = useSession();

  const handleLogin = () => {
    signIn();
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <Disclosure as="nav" className="bg-slate-300">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link
                href="/"
                className="italic font-bold text-slate-600 text-xl"
              >
                <div className="hover:scale-110 transition-all duration-300 leading-5">
                  <p>Church</p>
                  <p>Plus+</p>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex">
              <div className="flex items-center space-x-4">
                <Link
                  key="Membresia"
                  href="/membros"
                  className={`link ${pathname === "/membros" ? "text-slate-700 border-b-4 border-slate-500 px-3 py-2 text-lg font-medium" : "text-slate-500 border-b-4 border-transparent hover:border-slate-500 px-3 py-2 transition-all duration-300 text-lg font-medium"}`}
                >
                  Membros
                </Link>
                <Link
                  key="Financeiro"
                  href="/financas"
                  className={`link ${pathname === "/financas" ? "text-slate-700 border-b-4 border-slate-500 px-3 py-2 text-lg font-medium" : "text-slate-500 border-b-4 border-transparent hover:border-slate-500 px-3 py-2 transition-all duration-300 text-lg font-medium"}`}
                >
                  Financeiro
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {status === "loading" && (
              <ArrowPathIcon className="h-6 w-6 animate-spin" />
            )}

            {status === "unauthenticated" && (
              <button
                type="button"
                onClick={handleLogin}
                className="relative rounded-full border-2 border-slate-500 bg-slate-300 p-1 text-gray-500 hover:text-white hover:scale-110 duration-300"
              >
                <UserIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            )}

            {status === "authenticated" && (
              <Menu
                as="div"
                className="relative ml-3"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={data?.user?.image as string}
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  {/* <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                    >
                      Configurações
                    </a>
                  </MenuItem> */}
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 w-full text-left text-sm text-gray-700 data-[focus]:bg-gray-100"
                    >
                      Sair
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="flex flex-col gap-y-2 space-y-1 px-2 pb-3 pt-2 w-full">
          <Link
            href="/membros"
            className={`
              link ${
                pathname === "/membros"
                  ? "bg-gray-500 text-white border-b-2 px-3 py-2 text-base font-medium basis-auto"
                  : "text-gray-500 hover:bg-gray-700 hover:text-white border-b-2 px-3 py-2 text-base font-medium basis-auto"
              }
            `}
          >
            Membros
          </Link>

          <Link
            href="/financas"
            className={`
              link ${
                pathname === "/financas"
                  ? "bg-gray-500 text-white border-b-2 px-3 py-2 text-base font-medium"
                  : "text-gray-500 hover:bg-gray-700 hover:text-white border-b-2 px-3 py-2 text-base font-medium"
              }
            `}
          >
            Financeiro
          </Link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
