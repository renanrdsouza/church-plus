import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

interface RegisterFinancialContributionFormProps {
  memberId: string;
}

const schema = z.object({
  value: z
    .string()
    .refine((val) => !val.includes("R$"), {
      message: 'O valor não deve conter "R$"',
    })
    .refine((val) => /^\d+(,\d{1,2})?$/.test(val), {
      message: "O valor deve estar no formato correto (ex: 1234,56)",
    }),
  contributionType: z.enum(["Tithe", "Offering", "Donation", "Other"], {
    errorMap: () => ({ message: "Escolha uma opção válida" }),
  }),
});

type RegisterFinancialContributionData = z.infer<typeof schema>;

const RegisterFinancialContributionForm = (
  props: RegisterFinancialContributionFormProps,
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { memberId } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFinancialContributionData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFinancialContributionData) => {
    const body = {
      member_id: memberId,
      value: +data.value * 100,
      type: data.contributionType,
    };

    const response = await fetch(`${baseUrl}/api/v1/financial-contributions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      toast.success("Contribuição financeira inserida!", {
        duration: 2000,
      });
    } else {
      toast.error("Erro ao inserir contribuição financeira", {
        duration: 2000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label className="text-base">
        Valor:
        <input
          type="number"
          placeholder="0,00"
          {...register("value")}
          className="p-2 outline-none border-gray-300 rounded-md w-full mt-3"
        />
        {errors.value && (
          <p className="text-red-500 text-sm mt-2">{errors.value.message}</p>
        )}
      </label>
      <div className="flex flex-col">
        <label className="text-base mt-3">Tipo de contribuição:</label>
        <select
          id="contributionType"
          defaultValue="chooseOne"
          className="mt-3 p-2 rounded-md"
          {...register("contributionType")}
        >
          <option value="chooseOne" disabled>
            Escolha uma opção
          </option>
          <option value="Tithe">Dízimo</option>
          <option value="Offering">Oferta</option>
          <option value="Donation">Doação</option>
          <option value="Other">Outros</option>
        </select>
        {errors.contributionType && (
          <p className="text-red-500 text-sm mt-2">
            {errors.contributionType.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="p-2 mt-3 text-white bg-slate-500 rounded-md hover:bg-slate-300 hover:text-black transition-colors duration-300"
      >
        Cadastrar
      </button>
      <Toaster />
    </form>
  );
};

export default RegisterFinancialContributionForm;
