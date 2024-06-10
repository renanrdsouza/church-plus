export function buildMember(): IMember {
  const member = {
    name: "John Doe",
    cpf: "12345678901",
    birth_date: new Date(),
    email: "johndoe@email.com",
    baptism_date: new Date(),
    father_name: "John Doe Sr.",
    mother_name: "Jane Doe",
    education: "College",
    profession: "Developer",
    phone_list: [
      {
        phone_number: "123456789"
      }
    ],
    address_list: [
      {
        zip_code: "12345678",
        number: 123,
        street: "Main St",
        neighborhood: "Downtown",
        uf: "SP",
        city: "São Paulo",
      }
    ],
  };

  return member;
}
