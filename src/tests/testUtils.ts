import { Status } from "@/utils/enums";

export function buildMember(status: Status = Status.ACTIVE) {
  const member = {
    id: "1",
    name: "John Doe",
    cpf: "529.982.247-25",
    birth_date: new Date("1990-01-01"),
    email: "john.doe@example.com",
    baptism_date: new Date("2021-01-01"),
    father_name: "John Doe Sr.",
    mother_name: "Jane Doe",
    education: "Bachelor's Degree",
    profession: "Software Engineer",
    created_at: new Date("2021-01-01"),
    updated_at: new Date("2021-01-01"),
    status,
    user_id: "test-user-id",
    phone_list: [
      {
        id: "1",
        phone_number: "(24) 99999-9999",
      },
    ],
    address_list: [
      {
        city: "Springfield",
        complement: "Apt 123",
        neighborhood: "Downtown",
        number: 123,
        street: "123 Main St",
        uf: "IL",
        zip_code: "12345-678",
      },
    ],
  };

  return member;
}
