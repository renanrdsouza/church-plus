import { query, create, getMember, deleteMember, getAllMembers } from "../../models/database";
import { Status } from "../../utils/enums";
import { buildMember } from "../testUtils";
import { prismaMock } from "../singleton";

describe("query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should execute the query and return the result", async () => {
    const queryRaw = prismaMock.$queryRaw as jest.Mock;

    queryRaw.mockResolvedValue("result");
    prismaMock.$disconnect as jest.Mock;

    const result = await query('SELECT * FROM Member');

    expect(queryRaw).toHaveBeenCalledWith({ strings: ['SELECT * FROM Member'], values: [] });
    expect(result).toBe("result");
    expect(prismaMock.$disconnect).toHaveBeenCalled();
  });

  it("should handle errors during query execution", async () => {
    const queryRaw = prismaMock.$queryRaw as jest.Mock;
    queryRaw.mockRejectedValue(new Error("Query error"));
    console.error = jest.fn();

    const result = await query('SELECT * FROM Member');

    expect(queryRaw).toHaveBeenCalledWith({ strings: ['SELECT * FROM Member'], values: [] });
    expect(console.error).toHaveBeenCalledWith(
      "An error occurred during query execution: ",
      new Error("Query error")
    );
    expect(result).toBeUndefined();
    expect(prismaMock.$disconnect).toHaveBeenCalled();
  });
});

describe("create", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  it("should save a new member and return the saved member", async () => {
    const newMember = buildMember();
    prismaMock.member.create.mockResolvedValue(newMember);

    const result = await create(newMember);

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

    await expect(create(newMember)).rejects.toThrow("Member already exists");
  });
});

describe('getMember', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns a member when one exists with the provided id', async () => {
    const id = 'some-id';
    const mockMember = buildMember();

    prismaMock.member.findUniqueOrThrow.mockResolvedValue(mockMember);

    const member = await getMember(id);

    expect(member).toEqual(mockMember);
    expect(prismaMock.member.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true
      }
    });
  });

  it('throws an error when no member exists with the provided id', async () => {
    const id = 'some-id';

    prismaMock.member.findUniqueOrThrow.mockRejectedValue(new Error("No Member found"));

    await expect(getMember(id)).rejects.toThrow('No Member found');
    expect(prismaMock.member.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true
      }
    });
  });
});

describe('deleteMember', () => {
  const memberId = 'test-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call findUniqueOrThrow with the correct ID', async () => {
    await deleteMember(memberId);
    expect(prismaMock.member.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: memberId },
    });
  });

  it('should call update with the correct parameters', async () => {
    await deleteMember(memberId);
    expect(prismaMock.member.update).toHaveBeenCalledWith({
      where: { id: memberId },
      data: { status: Status.Inactive },
    });
  });

  it('should mark a member as inactive', async () => {
      prismaMock.member.findUniqueOrThrow.mockResolvedValueOnce({ 
        id: memberId,
        name: "John Doe",
        cpf: "123456789",
        birth_date: new Date(),
        email: "johndoe@example.com",
        baptism_date: new Date(),
        father_name: "John Doe Sr.",
        mother_name: "Jane Doe",
        education: "Bachelor's Degree",
        profession: "Software Engineer",
        created_at: new Date(),
        updated_at: new Date(),
        status: Status.Inactive 
      });
      prismaMock.member.update.mockResolvedValueOnce({ 
        id: memberId,
        name: "John Doe",
        cpf: "123456789",
        birth_date: new Date(),
        email: "johndoe@example.com",
        baptism_date: new Date(),
        father_name: "John Doe Sr.",
        mother_name: "Jane Doe",
        education: "Bachelor's Degree",
        profession: "Software Engineer",
        created_at: new Date(),
        updated_at: new Date(),
        status: Status.Inactive 
      });
  
      await deleteMember(memberId);
  
      expect(prismaMock.member.update).toHaveBeenCalledWith({
        where: { id: memberId },
        data: { status: Status.Inactive },
      });
  });

  // Optional: Test handling of invalid ID, assuming your function or Prisma throws an error
  it('should throw an error if the member does not exist', async () => {
    prismaMock.member.findUniqueOrThrow.mockRejectedValueOnce(new Error('Member not found'));

    await expect(deleteMember('invalid-id')).rejects.toThrow('Member not found');
  });
});

describe("getAllMembers", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return all active members", async () => {
    const mockMembers = [
      buildMember(),
      buildMember()
    ];

    prismaMock.member.findMany.mockResolvedValue(mockMembers);

    const members = await getAllMembers();

    expect(members).toEqual(mockMembers);
    expect(prismaMock.member.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.member.findMany).toHaveBeenCalledWith({
      where: {
        status: Status.Active,
      },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true,
      },
    });
  });

  it("should return an empty array if no active members found", async () => {
    prismaMock.member.findMany.mockResolvedValue([]);

    const members = await getAllMembers();

    expect(members).toEqual([]);
    expect(prismaMock.member.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.member.findMany).toHaveBeenCalledWith({
      where: {
        status: Status.Active,
      },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true,
      },
    });
  });

  it("should return an array only with members with status ACTIVE", async () => {
    const mockMembers = [
      buildMember(),
      buildMember(),
      buildMember(Status.Inactive)
    ]

    prismaMock.member.findMany.mockResolvedValue(mockMembers.filter(member => member.status === Status.Active));

    const members = await getAllMembers();

    expect(members.length).toBe(2);
    expect(prismaMock.member.findMany).toHaveBeenCalledTimes(1);
  })
});
