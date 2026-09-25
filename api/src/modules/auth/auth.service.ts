import bcrypt from "bcryptjs";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyVerificationToken,
  generateVerificationToken,
} from "../../common/utils/token";
import { prisma } from "../../db";
import type { RegisterUserDto } from "./auth.types";
import { HttpError } from "../../common/utils/http";
import { UserStatus } from "../../generated/prisma/enums";
import { httpStatus } from "../../common/types/http-status";
import { sendVerificationEmail } from "../../common/utils/email";
import { userRole, type UserRole } from "../../common/types/user-role";
export class AuthService {
  static async register(data: RegisterUserDto) {
    const { lastName, firstName, email, phoneNumber, role, password } = data;

    const isUserExists = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (isUserExists)
      throw new HttpError(
        400,
        httpStatus.FAIL,
        "User Already Exists with email or phone number",
      );

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        role: role ?? userRole.CUSTOMER,
        email,
        lastName: lastName ?? null,
        firstName,
        phoneNumber,
        password: hashedPassword,
      },
    });

    const emailVerificationToken = generateVerificationToken(
      newUser.id,
      newUser.email,
    );

    sendVerificationEmail(
      newUser.firstName,
      newUser.email,
      emailVerificationToken,
    );

    return newUser;
  }

  static login() {
    console.log("Login is Here... 🚀");
  }

  static logout() {
    console.log("Logout is Here... 🚀");
  }

  static requestResetPasswordToken() {
    console.log("Request Reset Password Token is Here... 🚀");
  }

  static resetPassword() {
    console.log("Reset Password is Here... 🚀");
  }

  static refreshToken() {
    console.log("Refresh Token is Here... 🚀");
  }

  static async verifyUserEmail(verifyToken: string) {
    if (!verifyToken)
      throw new HttpError(
        404,
        httpStatus.FAIL,
        "Verification token is required",
      );

    const decoded = verifyVerificationToken(verifyToken);
    const { id: userId, email } = decoded;

    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new HttpError(404, httpStatus.FAIL, "User not founded!");
    if (user.email !== email)
      throw new HttpError(400, httpStatus.FAIL, "Token mismatch!");
    if (user.status !== UserStatus.PENDING)
      throw new HttpError(400, httpStatus.FAIL, "User already active");

    user = await prisma.user.update({
      where: { id: user.id },
      data: { status: UserStatus.ACTIVE },
    });
    let { password, ...userData } = user;
    const { token, refreshToken } = this.generateUserTokens(user.id, user.role);

    return { user: { ...userData }, token, refreshToken };
  }

  static generateUserTokens(id: string, role: UserRole) {
    const token = generateAccessToken(id, role);
    const refreshToken = generateRefreshToken(id, role);

    return { token, refreshToken };
  }
}
