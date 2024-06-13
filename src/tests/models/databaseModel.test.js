import { query, saveMember } from "../../models/database";
import { buildMember } from "../../utils/utils";
import { prismaMock } from "../singleton";

describe("query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should execute the query and return the result", async () => {
    prismaMock.$queryRaw.mockResolvedValue("result");
    prismaMock.$disconnect.jest.fn();
    const result = await query('SELECT * FROM Member');

    expect(prismaMock.$queryRaw).toHaveBeenCalledWith({ strings: ['SELECT * FROM Member'], values: [] });
    expect(result).toBe("result");
    expect(prismaMock.$disconnect).toHaveBeenCalled();
  });

  it("should handle errors during query execution", async () => {
    prismaMock.$queryRaw.mockRejectedValue(new Error("Query error")),
    console.error = jest.fn();

    const result = await query('SELECT * FROM Member');

    expect(prismaMock.$queryRaw).toHaveBeenCalledWith({ strings: ['SELECT * FROM Member'], values: [] });
    expect(console.error).toHaveBeenCalledWith(
      "An error occurred during query execution: ",
      new Error("Query error")
    );
    expect(result).toBeUndefined();
    expect(prismaMock.$disconnect).toHaveBeenCalled();
  });
});

describe("saveMember", () => {
  let prismaMock;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    prismaMock = require("../../models/db").default;
    prismaMock.member = {
      findFirst: jest.fn(),
      create: jest.fn(),
    };
  });
  
  it("should save a new member and return the saved member", async () => {
    const newMember = buildMember();
    prismaMock.member.create.mockResolvedValue(newMember);

    const result = await saveMember(newMember);

    expect(prismaMock.member.findFirst).toHaveBeenCalledWith({
      where: {
        cpf: newMember.cpf,
      },
    });
    expect(prismaMock.member.create).toHaveBeenCalledWith({
      data: {
        name: newMember.name,
        cpf: newMember.cpf,
        birth_date: new Date(newMember.birth_date).toISOString(),
        email: newMember.email,
        baptism_date: new Date(newMember.baptism_date).toISOString(),
        father_name: newMember.father_name,
        mother_name: newMember.mother_name,
        education: newMember.education,
        profession: newMember.profession,
        financial_contributions: {
          create: [],
        },
        phone_list: {
          create: [
            {
              phone_number: newMember.phone_list[0].phone_number,
            }
          ],
        },
        address_list: {
          create: [
            {
              city: newMember.address_list[0].city,
              complement: newMember.address_list[0].complement,
              neighborhood: newMember.address_list[0].neighborhood,
              number: newMember.address_list[0].number,
              street: newMember.address_list[0].street,
              uf: newMember.address_list[0].uf,
              zip_code: newMember.address_list[0].zip_code,
            }
          ],
        },
      },
    });

    expect(result).toEqual(newMember);
  });

  it("should throw an error if the member already exists", async () => {
    const newMember = buildMember();
    prismaMock.member.create.mockRejectedValue(new Error("Member already exists"));

    await expect(saveMember(newMember)).rejects.toThrow("Member already exists");
  });
});
