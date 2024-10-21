import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const phoneSchema = z
  .string()
  .refine((val) => val === "" || /^\(\d{2}\) \d{5}-\d{4}$/.test(val), {
    message: "Telefone deve obedecer o formato (xx) xxxxx-xxxx",
  });

const schema = z
  .object({
    fullname: z
      .string()
      .min(1, { message: "Nome completo é obrigatório" })
      .regex(
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,
        "Apenas letras são permitidas",
      ),
    email: z.string().email("Deve ser um email válido"),
    cpf: z
      .string()
      .min(1, { message: "CPF é obrigatório" })
      .regex(
        /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/,
        "CPF deve obedecer o formato correto xxx.xxx.xxx-xx",
      ),
    birthdate: z
      .string()
      .min(1, { message: "Data de nascimento é obrigatória" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Data de nascimento inválida",
      }),
    baptismdate: z.string().optional().or(z.literal("")),
    rememberBaptismDate: z.boolean(),
    fathername: z
      .string()
      .min(1, { message: "Nome completo é obrigatório" })
      .regex(
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,
        "Apenas letras são permitidas",
      ),
    mothername: z
      .string()
      .min(1, { message: "Nome completo é obrigatório" })
      .regex(
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/,
        "Apenas letras são permitidas",
      ),
    education: z.enum(
      [
        "fundamentalIncompleto",
        "fundamentalCompleto",
        "medioIncompleto",
        "medioCompleto",
        "superiorIncompleto",
        "superiorCompleto",
        "outro",
      ],
      {
        errorMap: () => ({ message: "Escolha uma opção válida" }),
      },
    ),
    profession: z
      .string()
      .min(3, { message: "Preencha corretamente a profissão" })
      .regex(/^[a-zA-Z\s]{3,}$/, "Preencha corretamente a profissão"),
    street: z.string().min(1, { message: "Rua é obrigatória" }),
    city: z.string().min(1, { message: "Cidade é obrigatória" }),
    uf: z
      .string()
      .length(2, { message: "UF deve ter exatamente 2 caracteres" }),
    cep: z.string().regex(/^\d{5}-\d{3}$/, {
      message: "CEP deve obedecer o formato 00000-000",
    }),
    number: z.string().min(1, { message: "Número é obrigatório" }),
    neighborhood: z.string().min(1, { message: "Bairro é obrigatório" }),
    complement: z.string().optional(),
    phones: z
      .array(phoneSchema)
      .refine((phones) => phones.length > 0 && phones[0] !== "", {
        message: "Pelo menos 1(um) telefone é obrigatório",
        path: [0],
      })
      .refine((phones) => phones.length <= 3, {
        message: "Você pode adicionar no máximo 3 telefones",
      }),
  })
  .refine((data) => data.rememberBaptismDate || data.baptismdate, {
    message:
      "Data de batismo é obrigatória, caso não se lembre, marque a opção abaixo",
    path: ["baptismdate"],
  });

type CreateUserFormData = z.infer<typeof schema>;

interface MemberFormProps {
  memberId?: string;
}

const MemberForm = ({ memberId }: MemberFormProps) => {
  const { data, status } = useSession();
  const [cep, setCep] = useState<string>("");

  if (status === "unauthenticated" || !data?.user) {
    redirect("/");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(schema),
  });

  const rememberBaptismDate = watch("rememberBaptismDate");

  const onSubmit = async (data: CreateUserFormData) => {
    const phones = data.phones
      .filter((phone) => phone !== "")
      .map((phone) => {
        return { phone_number: phone };
      });
    const formatedData = {
      name: data.fullname,
      cpf: data.cpf,
      birth_date: data.birthdate,
      email: data.email,
      baptism_date: data.baptismdate || null,
      father_name: data.fathername,
      mother_name: data.mothername,
      education: data.education,
      profession: data.profession,
      phone_list: phones,
      address_list: [
        {
          zip_code: data.cep,
          number: parseInt(data.number),
          street: data.street,
          neighborhood: data.neighborhood,
          complement: data.complement || null,
          uf: data.uf,
          city: data.city,
        },
      ],
    };

    if (!memberId) {
      try {
        const response = await fetch(`${baseUrl}/api/v1/members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formatedData),
        });

        if (response.ok) {
          toast.success("Membro cadastrado com sucesso!", {
            duration: 2000,
          });
          reset();
        } else {
          const { error } = await response.json();
          toast.error(
            error === "Member already exists"
              ? "Membro já cadastrado"
              : "Erro ao cadastrar membro.",
          );
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      try {
        const response = await fetch(`${baseUrl}/api/v1/members/${memberId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formatedData),
        });

        if (response.ok) {
          toast.success("Membro atualizado com sucesso!", {
            duration: 2000,
          });
        } else {
          const { error } = await response.json();
          toast.error(
            error === "Member already exists"
              ? "Membro já cadastrado"
              : "Erro ao cadastrar membro.",
          );
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (cep.length === 5 && !cep.includes("-")) {
      setValue("cep", cep + "-");
    }

    if (cep.length === 9) {
      const handleAddress = async (cep: string) => {
        const viaCepUrl = `https://viacep.com.br/ws/${cep}/json/`;
        try {
          const response = await fetch(viaCepUrl);
          const data = await response.json();
          setValue("street", data.logradouro);
          setValue("city", data.localidade);
          setValue("neighborhood", data.bairro);
          setValue("uf", data.uf);
        } catch (error: any) {
          toast.error(error.message);
        }
      };

      handleAddress(cep);
    }
  }, [cep]);

  useEffect(() => {
    if (memberId) {
      const fetchMember = async () => {
        const response = await fetch(`${baseUrl}/api/v1/members/${memberId}`);
        const data = await response.json();
        const member = data.member;

        console.log(member);

        reset({
          fullname: member.name,
          cpf: member.cpf,
          birthdate: member.birth_date.split("T")[0],
          email: member.email,
          baptismdate: member.baptism_date
            ? member.baptism_date.split("T")[0]
            : "",
          rememberBaptismDate: member.baptism_date ? false : true,
          fathername: member.father_name,
          mothername: member.mother_name,
          education: member.education,
          profession: member.profession,
          cep: member.address_list[0].zip_code,
          street: member.address_list[0].street,
          city: member.address_list[0].city,
          uf: member.address_list[0].uf,
          number: member.address_list[0].number.toString(),
          neighborhood: member.address_list[0].neighborhood,
          complement: member.address_list[0].complement || "",
          phones: member.phone_list.map((phone: any) => phone.phone_number),
        });
      };

      fetchMember();
    }
  }, [memberId]);

  return (
    <>
      {status === "authenticated" && (
        <main className="bg-white p-10 rounded-xl my-5 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Informações pessoais
                </h2>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="fullname"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nome Completo
                    </label>
                    <div className="mt-2">
                      <input
                        id="fullname"
                        {...register("fullname")}
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.fullname && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.fullname.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        {...register("email")}
                        type="email"
                        autoComplete="email"
                        placeholder="email@email.com"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cpf"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      CPF
                    </label>
                    <div className="mt-2">
                      <input
                        id="cpf"
                        {...register("cpf")}
                        type="text"
                        autoComplete="given-cpf"
                        placeholder="xxx.xxx.xxx-xx"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.cpf && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.cpf.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="birthdate"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Data de Nascimento
                    </label>
                    <div className="mt-2">
                      <input
                        id="birthdate"
                        {...register("birthdate")}
                        type="date"
                        autoComplete="birthdate"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.birthdate && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.birthdate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="baptismdate"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Data de Batismo
                    </label>
                    <div className="mt-2">
                      <input
                        id="baptismdate"
                        {...register("baptismdate")}
                        type="date"
                        autoComplete="baptismdate"
                        disabled={rememberBaptismDate}
                        className={`${rememberBaptismDate ? "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 opacity-50" : "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"}`}
                      />
                      {errors.baptismdate && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.baptismdate.message}
                        </p>
                      )}
                    </div>

                    <div className="flex mt-2 sm:col-span-4">
                      <div className="mr-2">
                        <input
                          type="checkbox"
                          id="remember"
                          {...register("rememberBaptismDate")}
                        />
                      </div>
                      <label
                        htmlFor="remember"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Não me lembro
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-3 sm:col-start-1">
                    <label
                      htmlFor="fathername"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nome do Pai
                    </label>
                    <div className="mt-2">
                      <input
                        id="fathername"
                        {...register("fathername")}
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.fathername && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.fathername.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="mothername"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nome da Mãe
                    </label>
                    <div className="mt-2">
                      <input
                        id="mothername"
                        {...register("mothername")}
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.mothername && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.mothername.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="education"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Educação
                    </label>
                    <div className="mt-2">
                      <select
                        id="education"
                        {...register("education")}
                        autoComplete="education-name"
                        defaultValue="chooseOne"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="chooseOne" disabled>
                          Escolha uma opção
                        </option>
                        <option value="fundamentalIncompleto">
                          Fundamental incompleto
                        </option>
                        <option value="fundamentalCompleto">
                          Fundamental completo
                        </option>
                        <option value="medioIncompleto">
                          Ensino médio incompleto
                        </option>
                        <option value="medioCompleto">
                          Ensino médio completo
                        </option>
                        <option value="superiorIncompleto">
                          Ensino superior incompleto
                        </option>
                        <option value="superiorCompleto">
                          Ensino superior completo
                        </option>
                        <option value="outro">Outro...</option>
                      </select>
                      {errors.education && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.education.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="profession"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Profissão
                    </label>
                    <div className="mt-2">
                      <input
                        id="profession"
                        {...register("profession")}
                        type="text"
                        autoComplete="profession"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.profession && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.profession.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12 mt-2">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <h2 className="text-base font-semibold leading-7 text-gray-900 sm:col-span-full">
                    Informações de endereço
                  </h2>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cep"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      CEP
                    </label>
                    <div className="mt-2">
                      <input
                        id="cep"
                        {...register("cep")}
                        type="text"
                        autoComplete="cep"
                        placeholder="00000-000"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(event) => setCep(event.target.value)}
                      />
                      {errors.cep && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.cep.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Logradouro
                    </label>
                    <div className="mt-2">
                      <input
                        id="street"
                        {...register("street")}
                        type="text"
                        autoComplete="street"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.street && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.street.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cidade
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        {...register("city")}
                        type="text"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="uf"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Estado
                    </label>
                    <div className="mt-2">
                      <input
                        id="uf"
                        {...register("uf")}
                        type="text"
                        autoComplete="address-level1"
                        maxLength={2}
                        placeholder="ex: RJ"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.uf && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.uf.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="number"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Número
                    </label>
                    <div className="mt-2">
                      <input
                        id="number"
                        {...register("number")}
                        type="text"
                        autoComplete="number"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.number && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.number.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="neighborhood"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Bairro
                    </label>
                    <div className="mt-2">
                      <input
                        id="neighborhood"
                        {...register("neighborhood")}
                        type="text"
                        autoComplete="neighborhood"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.neighborhood && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.neighborhood.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="complement"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Complemento
                    </label>
                    <div className="mt-2">
                      <input
                        id="complement"
                        {...register("complement")}
                        type="text"
                        autoComplete="complement"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.complement && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.complement.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12 mt-2">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <h2 className="text-base font-semibold leading-7 text-gray-900 sm:col-span-full">
                  Telefone(s)
                </h2>
                {["phone1", "phone2", "phone3"].map((phone, index) => (
                  <div key={phone} className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor={phone}
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Telefone {index + 1}
                    </label>
                    <div className="mt-2">
                      <Controller
                        name={`phones.${index}`}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <input
                            {...field}
                            id={phone}
                            type="text"
                            autoComplete={phone}
                            placeholder="(xx) xxxxx-xxxx"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        )}
                      />
                      {errors.phones && errors.phones[index] && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.phones[index]?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Link
                href="/membros"
                type="button"
                className="text-sm px-3 py-2 rounded-md font-semibold leading-6 text-gray-900 bg-slate-200 hover:bg-slate-300 transition-all duration-200"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200"
              >
                {memberId ? "Atualizar" : "Cadastrar"}
              </button>
              <Toaster />
            </div>
          </form>
        </main>
      )}
    </>
  );
};

export default MemberForm;
