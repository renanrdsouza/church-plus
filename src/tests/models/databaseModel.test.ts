import {
  query,
  create,
  getMember,
  deleteMember,
  getAllMembers,
  getMemberLike,
} from "../../models/memberService";
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

    const result = await query("SELECT * FROM Member");

    expect(queryRaw).toHaveBeenCalledWith({
      strings: ["SELECT * FROM Member"],
      values: [],
    });
    expect(result).toBe("result");
    expect(prismaMock.$disconnect).toHaveBeenCalled();
  });

  it("should handle errors during query execution", async () => {
    const queryRaw = prismaMock.$queryRaw as jest.Mock;
    queryRaw.mockRejectedValue(new Error("Query error"));
    console.error = jest.fn();

    const result = await query("SELECT * FROM Member");

    expect(queryRaw).toHaveBeenCalledWith({
      strings: ["SELECT * FROM Member"],
      values: [],
    });
    expect(console.error).toHaveBeenCalledWith(
      "An error occurred during query execution: ",
      new Error("Query error"),
    );
    expect(result).toBeUndefined();
    expect(prismaMock.$disconnect).toHaveBeenCalled();
  });
});

describe("create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = "test-user-id"; // Replace with an appropriate userId for the test

  it("should save a new member and return the saved member", async () => {
    const newMember = buildMember();
    prismaMock.member.create.mockResolvedValue(newMember);

    const result = await create(newMember, userId);

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
        user_id: newMember.user_id,
        financial_contributions: {
          create: [],
        },
        phone_list: {
          create: [
            {
              phone_number: newMember.phone_list[0].phone_number,
            },
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
            },
          ],
        },
      },
    });

    expect(result).toEqual(newMember);
  });

  it("should throw an error if the member already exists", async () => {
    const newMember = buildMember();
    prismaMock.member.create.mockRejectedValue(
      new Error("Member already exists"),
    );

    await expect(create(newMember, userId)).rejects.toThrow(
      "Member already exists",
    );
  });
});

describe("getMember", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("returns a member when one exists with the provided id", async () => {
    const id = "some-id";
    const userId = "test-user-id";
    const mockMember = buildMember();

    prismaMock.member.findUniqueOrThrow.mockResolvedValue(mockMember);

    const member = await getMember(id, userId);

    expect(member).toEqual(mockMember);
    expect(prismaMock.member.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id, user_id: userId },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true,
      },
    });
  });

  it("throws an error when no member exists with the provided id", async () => {
    const id = "some-id";
    const userId = "test-user-id";

    prismaMock.member.findUniqueOrThrow.mockRejectedValue(
      new Error("No Member found"),
    );

    await expect(getMember(id, userId)).rejects.toThrow("No Member found");
    expect(prismaMock.member.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id, user_id: userId },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true,
      },
    });
  });
});

describe("deleteMember", () => {
  const member = buildMember();
  const userId = "test-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call findUniqueOrThrow with the correct ID", async () => {
    prismaMock.member.findUniqueOrThrow.mockResolvedValueOnce({
      ...member,
    });

    await deleteMember(member.id, userId);
    expect(prismaMock.member.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: member.id, user_id: userId }, // Adicione o campo user_id aqui
    });
  });

  it("should call update with the correct parameters", async () => {
    prismaMock.member.findUniqueOrThrow.mockResolvedValueOnce({
      ...member,
    });

    await deleteMember(member.id, userId);
    expect(prismaMock.member.update).toHaveBeenCalledWith({
      where: { id: member.id },
      data: { status: Status.INACTIVE },
    });
  });

  it("should mark a member as inactive", async () => {
    prismaMock.member.findUniqueOrThrow.mockResolvedValueOnce({
      ...member,
    });
    prismaMock.member.update.mockResolvedValueOnce({
      ...member,
      status: Status.INACTIVE,
    });

    await deleteMember(member.id, userId);

    expect(prismaMock.member.update).toHaveBeenCalledWith({
      where: { id: member.id },
      data: { status: Status.INACTIVE },
    });
  });

  it("should throw an error if the member does not exist", async () => {
    prismaMock.member.findUniqueOrThrow.mockRejectedValueOnce(
      new Error("Member not found"),
    );

    await expect(deleteMember("invalid-id", "invalid-user-id")).rejects.toThrow(
      "Member not found",
    );
  });
});

describe("getAllMembers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all active members", async () => {
    const mockMembers = [buildMember(), buildMember()];
    const userId = "test-user-id";

    prismaMock.member.findMany.mockResolvedValue(mockMembers);

    const members = await getAllMembers(userId);

    expect(members).toEqual(mockMembers);
    expect(prismaMock.member.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.member.findMany).toHaveBeenCalledWith({
      where: {
        status: Status.ACTIVE,
        user_id: userId, // Adicione o campo user_id aqui
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
    const userId = "test-user-id";

    const members = await getAllMembers(userId);

    expect(members).toEqual([]);
    expect(prismaMock.member.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.member.findMany).toHaveBeenCalledWith({
      where: {
        status: Status.ACTIVE,
        user_id: userId, // Adicione o campo user_id aqui
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
      buildMember(Status.INACTIVE),
    ];

    prismaMock.member.findMany.mockResolvedValue(
      mockMembers.filter((member) => member.status === Status.ACTIVE),
    );

    const userId = "test-user-id";
    const members = await getAllMembers(userId);

    expect(members.length).toBe(2);
    expect(prismaMock.member.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.member.findMany).toHaveBeenCalledWith({
      where: {
        status: Status.ACTIVE,
        user_id: userId, // Adicione o campo user_id aqui
      },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true,
      },
    });
  });
});

describe("getMemberLike", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return members that match the given name", async () => {
    const mockMembers = [buildMember(), buildMember()];

    prismaMock.member.findMany.mockResolvedValue(mockMembers);

    const result = await getMemberLike("Doe");

    expect(prismaMock.member.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: "Doe",
        },
      },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true,
      },
    });

    expect(result).toEqual(mockMembers);
  });

  it("should return an empty array if no members match the given name", async () => {
    prismaMock.member.findMany.mockResolvedValue([]);

    const result = await getMemberLike("NonExistentName");

    expect(prismaMock.member.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: "NonExistentName",
        },
      },
      include: {
        address_list: true,
        phone_list: true,
        financial_contributions: true,
      },
    });

    expect(result).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    prismaMock.member.findMany.mockRejectedValue(new Error("Database error"));

    await expect(getMemberLike("Doe")).rejects.toThrow("Database error");
  });
});
