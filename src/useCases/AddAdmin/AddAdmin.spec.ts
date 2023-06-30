import { test, describe, expect } from "vitest";
import { addAdminController } from ".";
import { AddAdminUseCase } from "./AddAdminUseCase";
import { AdminRepository } from "../../repositories/implementations/AdminRepository";
import { Admin } from "../../entities/Admin";

interface Admins {
  name: string;
  email: string;
  password: string;
}

class MockAdminRepository implements AdminRepository {
  admins: Admins[] = [];

  constructor() {
    this.admins = [];
  }

  async findByEmail(email: string): Promise<Admins | undefined> {
    const result = this.admins.find((admin) => admin.email === email);
    return result;
  }

  async addAdmin(admin: Admins): Promise<Admin> {
    const alreadyExists = await this.findByEmail(admin.email);

    if (alreadyExists) throw new Error("Admin already exists");

    this.admins.push({
      name: admin.name,
      email: admin.email,
      password: admin.password,
    });

    return admin;
  }
}

const repository = new AdminRepository();
const useCase = new AddAdminUseCase(repository);
const MockRepository = new MockAdminRepository();

describe("AddAdmin", () => {
  test("trying to add a new user without an email, should return an error", async () => {
    try {
      await useCase.execute({
        email: "",
        name: "John Doe",
        password: "123456",
      });

      throw new Error("Should not reach this point");
    } catch (error: any) {
      expect(error.message).toBe("Email is required");
    }
  });

  test("trying to add a new user without an name, should return an error", async () => {
    try {
      await useCase.execute({
        email: "jonhdoe@gmail.com",
        name: "",
        password: "123456",
      });

      throw new Error("Should not reach this point");
    } catch (error: any) {
      expect(error.message).toBe("Name is required");
    }
  });

  test("trying to add a new user without an name, should return an error", async () => {
    try {
      await useCase.execute({
        email: "jonhdoe@gmail.com",
        name: "jonhdoe",
        password: "",
      });

      throw new Error("Should not reach this point");
    } catch (error: any) {
      expect(error.message).toBe("Password is required");
    }
  });

  test("trying to add a new admin, should recive no error and a JSON", async () => {
    try {
      const admin = {
        email: "jonhdoe@gmail.com",
        name: "jonhdoe",
        password: "123456",
      };
      const result = await MockRepository.addAdmin(admin);
      expect(result).toBe(admin);
    } catch (error: any) {
      expect(!error.message).toBe(error);
    }
  });

  test("trying to add a new admin with an email that already exists, should return an error", async () => {
    try {
      const admin = {
        email: "jonhdoe@gmail.com",
        name: "johndoe",
        password: "123456",
      };
      const result = await MockRepository.addAdmin(admin);

      expect(!result).toBe(result);
    } catch (error: any) {
      expect(error.message).toBe("Admin already exists");
    }
  });
});
