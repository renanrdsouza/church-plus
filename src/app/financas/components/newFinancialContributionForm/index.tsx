"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import Loading from "../../loading";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  name: string;
}

const contributionSchema = z.object({
  memberId: z.string().min(1, { message: "Membro é obrigatório" }),
  contributionType: z
    .string()
    .refine((val) => ["Tithe", "Offering", "Donation", "Other"].includes(val), {
      message: "Tipo de contribuição é obrigatório",
    }),
  value: z
    .string()
    .refine((val) => !val.includes("R$"), {
      message: 'O valor não deve conter "R$"',
    })
    .refine((val) => /^\d+(,\d{1,2})?$/.test(val), {
      message: "O valor deve estar no formato correto (ex: 1234,56)",
    }),
});

type RegisterFinancialContributionData = z.infer<typeof contributionSchema>;

const RegisterFinancialContributionForm = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      memberId: "",
      contributionType: "",
      value: "",
    },
  });

  useEffect(() => {
    const fetchMembers = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/v1/members/`, {
        cache: "no-cache",
      });
      const membersData = await response.json();

      setMembers(membersData.members);
      setLoading(false);
    };

    fetchMembers();
  }, []);

  const onSubmit = async (formData: RegisterFinancialContributionData) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const body = {
      member_id: formData.memberId,
      value: parseInt(formData.value.replace(",", "")),
      type: formData.contributionType,
    };

    const response = await fetch(`${baseUrl}/api/v1/financial-contributions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      reset();

      toast.success("Contribuição financeira inserida!", {
        duration: 2000,
      });

      setTimeout(() => {
        router.push("/financas");
      }, 2000);
    } else {
      toast.error("Erro ao inserir contribuição financeira", {
        duration: 2000,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <label htmlFor="memberId">Membro</label>
          <select
            id="memberId"
            {...register("memberId")}
            className="p-2 outline-none border-gray-300 rounded-md w-full mt-3 max-h-52 max-w-md"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione um membro
            </option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {errors.memberId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.memberId?.message?.toString() || ""}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-base" htmlFor="value">
            Valor:
          </label>
          <input
            id="value"
            type="text"
            placeholder="0,00"
            {...register("value")}
            className="p-2 outline-none border-gray-300 rounded-md max-w-40 mt-3"
          />
          {errors.value && (
            <p className="text-red-500 text-sm mt-1">
              {errors.value?.message?.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <label className="text-base mb-3" htmlFor="contributionType">
            Tipo de contribuição:
          </label>
          <select
            id="contributionType"
            {...register("contributionType")}
            className="p-2 rounded-md max-w-52"
            defaultValue=""
          >
            <option value="" disabled>
              Escolha uma opção
            </option>
            <option value="Tithe">Dízimo</option>
            <option value="Offering">Oferta</option>
            <option value="Donation">Doação</option>
            <option value="Other">Outros</option>
          </select>
          {errors.contributionType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contributionType?.message?.toString()}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="p-2 mt-10 text-white bg-slate-500 rounded-md hover:bg-slate-300 hover:text-black transition-colors duration-300"
      >
        Cadastrar
      </button>
      <Toaster />
    </form>
  );
};

export default RegisterFinancialContributionForm;
