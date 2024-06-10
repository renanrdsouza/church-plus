interface IMember {
  name: string;
  cpf: string;
  birth_date: Date;
  email: string;
  baptism_date: Date;
  father_name: string;
  mother_name: string;
  education: string;
  profession: string;
  address_list?: IAddress[];
  phone_list?: IPhone[];
  created_at?: Date;
  updated_at?: Date;
}

interface IFinancialContribuition {
  created_at: Date;
  updated_at: Date;
  value: number;
  type: string;
}

interface IPhone {
  phone_number: string;
}

interface IAddress {
  zip_code: string;
  number: number;
  street: string;
  neighborhood: string;
  complement?: string;
  uf: string;
  city: string;
}
