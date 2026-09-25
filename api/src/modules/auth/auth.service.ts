import bcrypt from "bcryptjs";

import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  verifyVerificationToken,
  generateVerificationToken,
} from "../../common/utils/token";
import { prisma } from "../../db";
import { HttpError } from "../../common/utils/http";
import { UserStatus } from "../../generated/prisma/enums";
import { httpStatus } from "../../common/types/http-status";
import { sendVerificationEmail } from "../../common/utils/email";
import type { LoginUserDto, RegisterUserDto } from "./auth.types";
import { userRole, type UserRole } from "../../common/types/user-role";
export class AuthService {
  static async register(data: RegisterUserDto) {
    const { lastName, firstName, email, phoneNumber, role, password } = data;

    const isUserExists = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
      omit: { password: true },
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
      omit: { password: true },
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

  static async login(data: LoginUserDto) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user?.password)))
      throw new HttpError(401, httpStatus.FAIL, "Invalid credentials");

    if (user.status === UserStatus.PENDING)
      throw new HttpError(
        401,
        httpStatus.FAIL,
        "Email not active. Please verify your email",
      );

    if (user.status === UserStatus.SUSPENDED)
      throw new HttpError(
        401,
        httpStatus.FAIL,
        "Yor email is suspended right now. Contact technical support team",
      );

    const { token, refreshToken } = this.generateUserTokens(user.id, user.role);
    const { password: userPassword, ...userData } = user;

    return { user: userData, token, refreshToken };
  }

  // @TODO: Add the refreshToken encrypted or plain in the user table and then remove it on logout.
  static async logout(refreshToken: string) {
    if (!refreshToken)
      throw new HttpError(400, httpStatus.FAIL, "No Logged in user");

    console.log("refreshToken: ", refreshToken);
    return;
  }

  static requestResetPasswordToken() {
    console.log("Request Reset Password Token is Here... 🚀");
  }

  static resetPassword() {
    console.log("Reset Password is Here... 🚀");
  }

  static async refreshToken(refreshToken: string) {
    if (!refreshToken)
      throw new HttpError(401, httpStatus.FAIL, "No token provided");

    const { id } = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user)
      throw new HttpError(403, httpStatus.FAIL, "Invalid token provided");

    const token = generateAccessToken(user.id, user.role);
    return token;
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

    let user = await prisma.user.findFirst({
      where: { id: userId },
      omit: { password: true },
    });
    if (!user) throw new HttpError(404, httpStatus.FAIL, "User not founded!");
    if (user.email !== email)
      throw new HttpError(400, httpStatus.FAIL, "Token mismatch!");
    if (user.status !== UserStatus.PENDING)
      throw new HttpError(400, httpStatus.FAIL, "User already active");

    user = await prisma.user.update({
      where: { id: user.id },
      data: { status: UserStatus.ACTIVE },
      omit: { password: true },
    });
    const { token, refreshToken } = this.generateUserTokens(user.id, user.role);

    return { user, token, refreshToken };
  }

  static generateUserTokens(id: string, role: UserRole) {
    const token = generateAccessToken(id, role);
    const refreshToken = generateRefreshToken(id);

    return { token, refreshToken };
  }
}
