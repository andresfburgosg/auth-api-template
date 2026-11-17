import { Request, Response } from "express";
import { UserControllerDependencies } from "../types/User.js";
import { RegisterSchemaRequestBody } from "../schemas/userValidationSchemas.js";
import { CreateUserData } from "../../../domain/users/repositories/UserRepository.js";

export class UserController {
  constructor(private readonly dependencies: UserControllerDependencies) {}

  async create(req: Request, res: Response) {
    const bodyReq = req.body as RegisterSchemaRequestBody;
    const createUserData = this.#toCreateUserData(bodyReq, req.file);
    const userCreated = await this.dependencies.createUser.execute(
      createUserData
    );

    return res.status(201).json({ data: userCreated });
  }

  #toCreateUserData(
    body: RegisterSchemaRequestBody,
    file?: Express.Multer.File
  ): CreateUserData {
    return {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneCountryCode: body.phoneCountryCode,
      phoneNumber: body.phoneNumber,
      password: body.password,
      isActive: false,
      profilePicture: file?.buffer,
    };
  }
}
