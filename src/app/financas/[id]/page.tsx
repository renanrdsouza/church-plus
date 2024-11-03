"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Container from "@/app/components/container";
import Loading from "@/app/membros/loading";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const contributionSchema = z.object({
  contributionType: z.enum(["Tithe", "Offering", "Donation", "Other"], {
    required_error: "Tipo de contribuição é obrigatório",
  }),
  value: z
    .string()
    .regex(/^\d+,\d{2}$/, "Valor deve estar no formato 0,00")
    .transform((val) => parseFloat(val.replace(",", ".")) * 100),
});

interface FinancialContributionProps {
  params: {
    id: string;
  };
}

const getData = async (contributionId: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const contributionResponse = await fetch(
    `${baseUrl}/api/v1/financial-contributions/contribution/${contributionId}`,
  );
  const contributionData = await contributionResponse.json();

  const memberResponse = await fetch(
    `${baseUrl}/api/v1/members/${contributionData.contribution.member_id}`,
  );
  const memberData = await memberResponse.json();

  return {
    contribution: contributionData.contribution,
    member: memberData.member,
  };
};

const FinancialContribution = ({ params }: FinancialContributionProps) => {
  const { data, status } = useSession();

  if (status === "unauthenticated" || !data?.user) {
    redirect("/");
  }

  const [retrievedData, setRetrievedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contributionSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData(params.id);
      setRetrievedData(result);
      setLoading(false);

      setValue("contributionType", result.contribution.type);
      setValue(
        "value",
        (result.contribution.value / 100).toFixed(2).replace(".", ","),
      );
    };

    fetchData();
  }, [params.id, setValue]);

  const onSubmit = async (formData: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${baseUrl}/api/v1/financial-contributions/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.contributionType,
          value: formData.value,
        }),
      },
    );

    if (response.ok) {
      toast.success("Dados alterados com sucesso!", {
        duration: 2000,
      });
    } else {
      toast.error("Erro ao alterar dados!", {
        duration: 2000,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      {status === "authenticated" && (
        <main className="mt-10 p-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col gap-y-10 p-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Membro</h1>
              <p className="text-xl font-bold">{retrievedData.member.name}</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col justify-between">
                  <label className="text-base mb-3 font-medium text-gray-700">
                    Tipo de contribuição:
                  </label>
                  <select
                    id="contributionType"
                    {...register("contributionType")}
                    className="p-2 rounded-md mt-4"
                  >
                    <option value="chooseOne" disabled>
                      Escolha uma opção
                    </option>
                    <option value="Tithe">Dízimo</option>
                    <option value="Offering">Oferta</option>
                    <option value="Donation">Doação</option>
                    <option value="Other">Outros</option>
                  </select>
                  {errors.contributionType?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof errors.contributionType.message === "string" &&
                        errors.contributionType.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <label
                    htmlFor="value"
                    className="text-base mb-3 font-medium text-gray-700"
                  >
                    Valor:
                  </label>
                  <input
                    type="text"
                    id="value"
                    {...register("value")}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.value?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof errors.value.message === "string" &&
                        errors.value.message}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-base mb-33 font-medium text-gray-700">
                    Data:{" "}
                    {retrievedData.contribution.updated_at
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-slate-500 rounded-md p-2 text-white hover:bg-slate-300 hover:text-black transition-colors duration-300"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
            <Toaster />
          </div>
        </main>
      )}
    </Container>
  );
};

export default FinancialContribution;
