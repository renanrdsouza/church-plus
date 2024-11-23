"use client";
import Modal from "@/app/components/Modal";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FinancialContributionProps {
  id: string;
  member_id: string;
  type: string;
  value: number;
  updated_at: string;
  owner?: string;
}

interface ContributionsTableProps {
  contributions: FinancialContributionProps[];
}

const ContributionsTable = ({ contributions }: ContributionsTableProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [contributionsReceived, setContributionsReceived] = useState<
    FinancialContributionProps[]
  >([]);
  const [open, setIsOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");

  useEffect(() => {
    setContributionsReceived([...contributions]);
  }, [contributions]);

  const formatValue = (value: number) => {
    return (value / 100).toFixed(2).replace(".", ",");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatType = (type: string) => {
    const formattedTypes: { [key: string]: string } = {
      Offering: "Oferta",
      Tithe: "Dízimo",
      Donation: "Doação",
      Other: "Outro",
    };

    return formattedTypes[type] ? formattedTypes[type] : "Nenhum tipo";
  };

  const handleDeleteItem = async (id: string) => {
    await fetch(`${baseUrl}/api/v1/financial-contributions/${id}`, {
      method: "DELETE",
    });

    const filteredItems = contributions.filter(
      (contribution) => contribution.id !== id,
    );
    setContributionsReceived([...filteredItems]);
    setIsOpen(false);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tipo
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Valor(R$)
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Data
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {contributionsReceived.length > 0 ? (
            contributionsReceived.map(
              (contribution: FinancialContributionProps) => (
                <tr
                  key={contribution.id}
                  className="odd:bg-slate-100 odd:dark:bg-slate-100 even:bg-gray-50 even:dark:bg-slate-300 border-b"
                >
                  <td className="px-6 py-4 text-center">
                    {formatType(contribution.type)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {formatValue(contribution.value)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {formatDate(contribution.updated_at)}
                  </td>
                  <td className="px-6 py-4 flex gap-x-2 justify-center">
                    <Link
                      href={`/financas/${contribution.id}`}
                      className="bg-slate-500 rounded-md p-2 sm:p-3 text-white hover:bg-slate-300 hover:text-black transition-colors duration-300"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(true), setItemToDelete(contribution.id);
                      }}
                      type="submit"
                      className="bg-red-400 p-2 sm:p-3 text-center rounded-md hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ),
            )
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                Nenhum dado a ser exibido...
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
    </div>
  );
};

export default ContributionsTable;
