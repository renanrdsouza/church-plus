import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

interface RegisterFinancialContributionFormProps {
  memberId: string;
  modifyLastContributionValue: (value: string) => void;
  modifyLastContributionType: (value: string) => void;
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
    reset,
  } = useForm<RegisterFinancialContributionData>({
    resolver: zodResolver(schema),
  });

  const handleLastContribution = (value: any) => {
    props.modifyLastContributionValue(
      (value / 100).toFixed(2).replace(".", ","),
    );
  };

  const handleLastFinancialContributionType = (type: any) => {
    const translatedTypes: { [key: string]: string } = {
      Tithe: "Dízimo",
      Offering: "Oferta",
      Donation: "Doação",
      Other: "Outro",
    };

    props.modifyLastContributionType(translatedTypes[type]);
  };

  const onSubmit = async (data: RegisterFinancialContributionData) => {
    const body = {
      member_id: memberId,
      value: parseInt(data.value.replace(",", "")),
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
      handleLastContribution(body.value);
      handleLastFinancialContributionType(body.type);
      reset();

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
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-base">
            Valor:
            <input
              type="text"
              placeholder="0,00"
              {...register("value")}
              className="p-2 outline-none border-gray-300 rounded-md w-full mt-3"
            />
            {errors.value && (
              <p className="text-red-500 text-sm mt-2">
                {errors.value.message}
              </p>
            )}
          </label>
        </div>
        <div className="flex flex-col justify-between">
          <label className="text-base mb-3">Tipo de contribuição:</label>
          <select
            id="contributionType"
            defaultValue="chooseOne"
            className="p-2 rounded-md"
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
