"use client";
import Container from "@/app/components/container";
import { IFinancialContribuition, IMember } from "@/models/modelsInterfaces";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import RegisterFinancialContributionForm from "./components/registerFinancialContributionForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ContributionsTable from "@/app/financas/components/contributionsTable";

interface MemberDetailProps {
  params: {
    id: string;
  };
}

interface FinancialContribution {
  id: string;
  created_at: string;
  updated_at: string;
  value: number;
  type: string;
  member_id: string;
}

const MemberDetail = ({ params }: MemberDetailProps) => {
  const { data, status } = useSession();

  if (status === "unauthenticated" || !data?.user) {
    redirect("/");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const id = params.id;
  const [member, setMember] = useState<IMember | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showMemberDetails, setShowMemberDetails] = useState(true);
  const [showFinancialDetails, setShowFinancialDetails] = useState(true);
  const [formatedEducation, setFormatedEducation] = useState<string>();
  const [lastContribution, setLastContribution] = useState<string>();
  const [lastFinancialContributionType, setLastFinancialContributionType] =
    useState<string>();
  const [financialContributions, setFinancialContributions] =
    useState<FinancialContribution[]>();

  const handleEducation = (education: string | undefined) => {
    const educationLevels: { [key: string]: string } = {
      fundamentalIncompleto: "Ensino fundamental incompleto",
      fundamentalCompleto: "Ensino fundamental completo",
      medioIncompleto: "Ensino médio incompleto",
      medioCompleto: "Ensino médio completo",
      superiorIncompleto: "Ensino superior incompleto",
      superiorCompleto: "Ensino superior completo",
      outro: "Outro",
    };

    if (education !== undefined) {
      setFormatedEducation(educationLevels[education]);
    }
  };

  const handleLastContribution = (contributions: IFinancialContribuition[]) => {
    if (contributions.length > 0) {
      const lastContribution =
        (contributions[contributions.length - 1].value / 100)
          .toFixed(2)
          .replace(".", ",") || "--,--";
      setLastContribution(lastContribution);
    } else {
      setLastContribution("--,--");
    }
  };

  const handleLastFinancialContributionType = (
    contributions: IFinancialContribuition[],
  ) => {
    const translatedTypes: { [key: string]: string } = {
      Tithe: "Dízimo",
      Offering: "Oferta",
      Donation: "Doação",
      Other: "Outro",
    };

    if (contributions.length > 0) {
      const lastContributionType = contributions[contributions.length - 1].type;
      setLastFinancialContributionType(
        translatedTypes[lastContributionType] || "N/A",
      );
    } else {
      setLastFinancialContributionType("N/A");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${baseUrl}/api/v1/members/${id}`);
        const data = await response.json();
        handleEducation(data.member.education);
        setMember(data.member);
        handleLastContribution(data.member.financial_contributions);
        handleLastFinancialContributionType(
          data.member.financial_contributions,
        );
        setFinancialContributions(data.member.financial_contributions);
      } catch (error) {
        console.error("Erro ao buscar dados do membro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, baseUrl]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      {status === "authenticated" && data?.user && (
        <main className="h-screen">
          <div className="m-3 sm:mt-7 p-4 rounded-md border-2 shadow-xl">
            <div className="flex justify-between items-center px-4 sm:px-0">
              <h3 className="font-bold text-2xl leading-7 text-gray-900">
                Detalhes do membro
              </h3>
              <button
                onClick={() => setShowMemberDetails(!showMemberDetails)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showMemberDetails ? (
                  <ChevronUpIcon className="h-6 w-6" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            {showMemberDetails && (
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Nome completo
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {member?.name}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Profissão
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {member?.profession}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Nome do pai
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {member?.father_name}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Nome da mãe
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {member?.mother_name}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Educação
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formatedEducation}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {member?.email}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Data de nascimento
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {member?.birth_date
                        ?.toString()
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("/")}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Data do batismo
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {member?.baptism_date
                        ? member?.baptism_date
                            .toString()
                            .slice(0, 10)
                            .split("-")
                            .reverse()
                            .join("/")
                        : "Não informado"}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Telefone(s)
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <ul>
                        {member?.phone_list.map((phone) => (
                          <li key={phone.id}>{phone.phone_number}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Endereço
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {member?.address_list.map((address) => (
                        <div key={address.id}>
                          <p>
                            Logradouro: {address.street}, {address.number}
                          </p>
                          <p>Bairro: {address.neighborhood}</p>
                          <p>Complemento: {address.complement || "Não há"}</p>
                          <p>Cidade: {address.city}</p>
                          <p>Estado: {address.uf}</p>
                          <p>CEP: {address.zip_code}</p>
                        </div>
                      ))}
                    </dd>
                  </div>
                </dl>
                <button className="bg-slate-500 rounded-md p-2 text-white hover:bg-slate-300 hover:text-black transition-colors duration-300">
                  Editar
                </button>
              </div>
            )}
          </div>

          <div className="m-3 sm:mt-7 p-4 rounded-md border-2 shadow-xl">
            <div className="flex justify-between items-center px-4 sm:px-0">
              <h3 className="font-bold text-2xl leading-7 text-gray-900">
                Detalhes financeiros
              </h3>
              <button
                onClick={() => setShowFinancialDetails(!showFinancialDetails)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showFinancialDetails ? (
                  <ChevronUpIcon className="h-6 w-6" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            {showFinancialDetails && (
              <div className="grid grid-cols-1 gap-5 sm:gap-x-5 mt-5">
                <div className="p-4 rounded-md border-2 shadow-sm">
                  <div className="flex justify-between">
                    <h2 className="text-base font-semibold ">
                      Última contribuição
                    </h2>
                    <p>Tipo: {lastFinancialContributionType}</p>
                  </div>
                  <p className="text-xl mt-2">
                    <span className="text-2xl font-semibold">R$</span>{" "}
                    {lastContribution}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:col-start-1 sm:col-end-3">
                  <h2 className="text-xl font-semibold">
                    Cadastrar novo valor
                  </h2>
                  <RegisterFinancialContributionForm
                    memberId={id}
                    modifyLastContributionValue={setLastContribution}
                    modifyLastContributionType={
                      setLastFinancialContributionType
                    }
                    actualContributions={financialContributions}
                    setContributions={setFinancialContributions}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="m-3 sm:mt-7 p-4 rounded-md border-2 shadow-xl">
            <h2 className="font-semibold">Todas as contribuições do membro</h2>
            {financialContributions && (
              <ContributionsTable contributions={financialContributions} />
            )}
          </div>
        </main>
      )}
    </Container>
  );
};

export default MemberDetail;
