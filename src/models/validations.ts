function validateCPF(cpf: string): boolean {
  const cpfRegex = /^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/;

  if (!cpfRegex.test(cpf) || cpf === "000.000.000-00" || cpf.trim() === "") {
    throw new Error("Invalid CPF");
  }

  const formattedCpf = cpf.split(".").join("").split("-").join("");
  let rest = 0;
  let sum = 0;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(formattedCpf.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(formattedCpf.substring(9, 10))) {
    throw new Error("Invalid CPF");
  }

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(formattedCpf.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(formattedCpf.substring(10, 11))) {
    throw new Error("Invalid CPF");
  }

  return true;
}

function validateDate(date: Date): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  const parsedDate = new Date(date).toISOString();
  
  if (!dateRegex.test(parsedDate)) {
    throw new Error("Invalid date");
  }

  return true;
}

function validateName(name: string): boolean {
  const nameRegex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

  if (!nameRegex.test(name) || name.trim() === "") {
    throw new Error("Invalid name");
  }

  return true;
}

function validateEmail(email: string): boolean {
  const emailRegex = /\S+@\w+\.\w{2,}(\.\w{2})?/gm;

  if (!emailRegex.test(email) || email.trim() === "") {
    throw new Error("Invalid email");
  }

  return true;
}

function validateProfession(profession: string): boolean {
  const professionRegex = /^[a-zA-Z\s]{3,}$/;

  if (!professionRegex.test(profession) || profession.trim() === "") {
    throw new Error("Invalid profession");
  }

  return true;
}

function validateAddressList(addressList: IAddress[]): boolean {
  if (addressList.length === 0) {
    throw new Error("Address list cannot be empty");
  }

  return true;
}

function validatePhoneList(phoneList: IPhone[]): boolean {
  if (phoneList.length === 0) {
    throw new Error("Phone list cannot be empty");
  }

  phoneList.forEach((phone) => {
    const phoneRegex = /(\(\d{2}\)\s?)?\d{4,5}-\d{4}/g;

    if (
      !phoneRegex.test(phone.phone_number) ||
      phone.phone_number.trim() === ""
    ) {
      throw new Error("Invalid phone number");
    }
  });

  return true;
}

function validateNewMember(newMember: IMember) {
  [newMember.name, newMember.father_name, newMember.mother_name].forEach(
    validateName,
  );
  validateCPF(newMember.cpf);
  [newMember.birth_date, newMember.baptism_date].forEach(validateDate);
  validateEmail(newMember.email);
  validateProfession(newMember.profession);
  validateAddressList(newMember.address_list || []);
  validatePhoneList(newMember.phone_list || []);
}

function validateUpdateMember(updateRequestMember: IMemberPutRequest) {
  const validators: { [key: string]: (value: any) => boolean } = {
    name: validateName,
    father_name: validateName,
    mother_name: validateName,
    birth_date: validateDate,
    baptism_date: validateDate,
    email: validateEmail,
    profession: validateProfession,
    address_list: validateAddressList,
    phone_list: validatePhoneList,
  };

  for (const key in validators) {
    if (updateRequestMember[key]) {
      validators[key](updateRequestMember[key]);
    }
  }
}

export {
  validateNewMember,
  validateUpdateMember
}
