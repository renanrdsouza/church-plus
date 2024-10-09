import { FinancialContributionType } from "@/utils/enums";

export interface IMember {
  [key: string]: any;
  name: string;
  cpf: string;
  birth_date: Date;
  email: string;
  baptism_date: Date;
  father_name: string;
  mother_name: string;
  education: string;
  profession: string;
  address_list: IAddress[];
  phone_list: IPhone[];
  created_at?: Date;
  updated_at?: Date;
  user_id: string;
}

export interface IFinancialContribuition {
  created_at?: Date;
  updated_at?: Date;
  value: number;
  type: string;
  member_id: string;
  user_id: string;
}

export interface IPhone {
  id?: string;
  phone_number: string;
}

export interface IAddress {
  id?: string;
  zip_code: string;
  number: number;
  street: string;
  neighborhood: string;
  complement?: string;
  uf: string;
  city: string;
}

export interface IMemberPutRequest {
  [key: string]: any;
  name?: string;
  birth_date?: Date;
  email?: string;
  baptism_date?: Date;
  father_name?: string;
  mother_name?: string;
  education?: string;
  profession?: string;
  address_list: IAddress[];
  phone_list: IPhone[];
}

export interface IFinancialContributionPutRequest {
  value: number;
  type: FinancialContributionType;
}
