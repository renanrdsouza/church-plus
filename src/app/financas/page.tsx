"use client";
import { useEffect, useState } from "react";
import Container from "../components/container";
import BarsDataset from "./components/barGraphic";
import { subMonths } from "date-fns";
import Link from "next/link";

interface FinancialContribution {
  id: string;
  created_at: string;
  updated_at: string;
  value: number;
  type: string;
  member_id: string;
}

const Financas = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [financialContributions, setFinancialContributions] = useState<
    FinancialContribution[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastContribution, setLastContribution] = useState<string>();
  const now = new Date().toISOString();
  const lastOneYear = subMonths(new Date(), 12);

  const formatCurrency = (value: number) =>
    (value / 100).toFixed(2).replace(".", ",");

  const formatContributionType = (type: string) => {
    const formattedTypes: { [key: string]: string } = {
      Offering: "Oferta",
      Tithe: "Dízimo",
      Donation: "Doação",
      Other: "Outro",
    };

    return formattedTypes[type] ? formattedTypes[type] : "Nenhum tipo";
  };

  const getTotalValue = (contributions: FinancialContribution[]) => {
    const value = contributions
      .filter(
        (contribution) =>
          new Date(contribution.updated_at) > subMonths(new Date(), 1),
      )
      .reduce((acc, curr) => acc + curr.value, 0);
    return formatCurrency(value);
  };

  const getLastContribution = (contributions: FinancialContribution[]) => {
    const lastContribution = contributions
      .filter(
        (contribution) =>
          new Date(contribution.updated_at) > subMonths(new Date(), 1),
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )[0];
    return lastContribution ? formatCurrency(lastContribution.value) : "0,00";
  };

  const getMostCommonType = (contributions: FinancialContribution[]) => {
    const types = contributions
      .filter(
        (contribution) =>
          new Date(contribution.updated_at) > subMonths(new Date(), 1),
      )
      .map((contribution) => contribution.type);

    const mostCommonType = types
      .sort(
        (a, b) =>
          types.filter((v) => v === a).length -
          types.filter((v) => v === b).length,
      )
      .pop();

    const formattedTypes: { [key: string]: string } = {
      Offering: "Oferta",
      Tithe: "Dízimo",
      Donation: "Doação",
      Other: "Outro",
    };

    return mostCommonType && formattedTypes[mostCommonType]
      ? formattedTypes[mostCommonType]
      : "Nenhum tipo";
  };

  useEffect(() => {
    setLoading(true);

    fetch(
      `${baseUrl}/api/v1/financial-contributions?fromDate=${lastOneYear.toISOString()}&toDate=${now}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setFinancialContributions(data.contributions);
        setLastContribution(getLastContribution(data.contributions));
      });

    setLoading(false);
  }, [baseUrl]);

  return (
    <Container>
      <main className="h-screen">
        <div className="mt-7 p-4 rounded-md border-2 shadow-xl">
          <h1 className="text-2xl font-bold">Finanças</h1>
          <h2 className="mt-5 font-semibold">Últimos 30 dias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="p-6 rounded-md border-2 shadow-sm">
              <h3 className="text-slate-600">Valor total</h3>
              <p className="font-semibold text-2xl md:text-3xl">
                R${getTotalValue(financialContributions)}
              </p>
            </div>
            <div className="p-6 rounded-md border-2 shadow-sm">
              <h3 className="text-slate-600">Última contribuição</h3>
              <p className="font-semibold text-2xl md:text-3xl">
                R${lastContribution}
              </p>
            </div>
            <div className="p-6 rounded-md border-2 shadow-sm">
              <h3 className="text-slate-600">
                Tipo de contribuição mais frequente
              </h3>
              <p className="font-semibold text-2xl md:text-3xl">
                {getMostCommonType(financialContributions)}
              </p>
            </div>
          </div>
          <div>
            <h2 className="mt-10 font-semibold">
              Evolução mensal das contribuições no último ano
            </h2>
            <div className="hidden sm:flex w-full h-96 mt-7">
              <BarsDataset contributions={financialContributions} />
            </div>
          </div>
          <div className="mt-10">
            <ul role="list" className="divide-y divide-gray-100">
              {financialContributions.length > 0 ? (
                financialContributions.map((contribution) => (
                  <li key={contribution.id}>
                    <Link
                      href={`/${contribution.id}`}
                      className="flex justify-between mt-4 shadow-xl py-5 px-10 flex-wrap"
                    >
                      <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            Valor: R${formatCurrency(contribution.value)}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                            Data de cadastro:{" "}
                            {new Date(
                              contribution.updated_at,
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 sm:flex sm:flex-col sm:items-end mt-1">
                        <p className="text-sm leading-6 text-gray-900">
                          Tipo: {formatContributionType(contribution.type)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <div>Nenhum dado a ser exibido...</div>
              )}
            </ul>
          </div>
        </div>
      </main>
    </Container>
  );
};

export default Financas;
