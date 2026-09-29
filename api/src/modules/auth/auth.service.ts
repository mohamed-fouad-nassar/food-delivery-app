import bcrypt from "bcryptjs";
import {
  hashToken,
  verifyToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  verifyVerificationToken,
  verifyResetPasswordToken,
  generateVerificationToken,
  generateResetPasswordToken,
} from "../../common/utils/token";
import {
  sendVerificationEmail,
  sendResetPasswordToken,
} from "../../common/utils/email";
import { prisma } from "../../db";
import { HttpError } from "../../common/utils/http";
import { UserStatus } from "../../generated/prisma/enums";
import { httpStatus } from "../../common/types/http-status";
import type { LoginUserDto, RegisterUserDto } from "./auth.types";
import { calcExpiryFromMs } from "../../common/utils/calculate-expiry";
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
        409,
        httpStatus.FAIL,
        "User Already Exists with email or phone number",
      );

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
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
      user.id,
      user.email,
    );
    const emailPreviewUrl = await sendVerificationEmail(
      user.firstName,
      user.email,
      emailVerificationToken,
    );

    return { user, emailPreviewUrl };
  }

  static async login(data: LoginUserDto) {
    const { email, password } = data;
    const user = await prisma.user.findUnique({
      where: { email },
      omit: { refreshTokenHash: true, refreshTokenExpiresAt: true },
    });
    if (!user) throw new HttpError(404, httpStatus.FAIL, "User not found");

    if (!(await bcrypt.compare(password, user?.password)))
      throw new HttpError(401, httpStatus.FAIL, "Invalid credentials");

    if (user.status === UserStatus.PENDING)
      throw new HttpError(
        403,
        httpStatus.FAIL,
        "Email not active. Please verify your email",
      );

    if (user.status === UserStatus.SUSPENDED)
      throw new HttpError(
        403,
        httpStatus.FAIL,
        "Yor email is suspended right now. Contact technical support team",
      );

    const { token, refreshToken, refreshExpiryAtInMS } =
      this.generateUserTokens(user.id, user.role);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        refreshTokenHash: hashToken(refreshToken),
        refreshTokenExpiresAt: calcExpiryFromMs(refreshExpiryAtInMS),
      },
    });
    const { password: _, ...userData } = user;

    return { user: userData, token, refreshToken };
  }

  static async logout(refreshToken: string) {
    if (!refreshToken)
      throw new HttpError(401, httpStatus.FAIL, "No Logged in user");

    const { id } = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user || hashToken(refreshToken) !== user.refreshTokenHash)
      throw new HttpError(403, httpStatus.FAIL, "Invalid token provided");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenExpiresAt: null,
        refreshTokenHash: null,
      },
    });
  }

  static async requestResetPasswordToken(email: string) {
    const user = await prisma.user.findFirst({
      where: { email },
      omit: { password: true },
    });
    if (!user) throw new HttpError(404, httpStatus.FAIL, "User Not Found");

    if (user.status === UserStatus.PENDING)
      throw new HttpError(
        403,
        httpStatus.FAIL,
        "Email not active. Please verify your email",
      );

    if (user.status === UserStatus.SUSPENDED)
      throw new HttpError(
        403,
        httpStatus.FAIL,
        "Yor email is suspended right now. Contact technical support team",
      );

    const resetPasswordToken = generateResetPasswordToken(user.id, user.email);
    const resetExpiryAtInMin = 24 * 60 * 60 * 1000;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: hashToken(resetPasswordToken),
        passwordResetTokenExpiresAt: calcExpiryFromMs(resetExpiryAtInMin),
      },
    });

    const emailPreviewUrl = sendResetPasswordToken(
      user.firstName,
      user.email,
      resetPasswordToken,
    );

    return emailPreviewUrl;
  }

  static async resetPassword(password: string, resetPasswordToken: string) {
    if (!resetPasswordToken)
      throw new HttpError(
        404,
        httpStatus.FAIL,
        "Reset password token is required",
      );

    const { id } = verifyResetPasswordToken(resetPasswordToken);
    let user = await prisma.user.findFirst({
      where: { id },
      omit: { password: true },
    });
    if (!user) throw new HttpError(404, httpStatus.FAIL, "User not found");
    if (hashToken(resetPasswordToken) !== user.passwordResetTokenHash)
      throw new HttpError(
        400,
        httpStatus.FAIL,
        "Reset password token miss match",
      );
    if (user.status !== UserStatus.ACTIVE)
      throw new HttpError(403, httpStatus.FAIL, "User account must be active");

    const expiresAt = user.passwordResetTokenExpiresAt;
    if (!expiresAt || expiresAt <= new Date())
      throw new HttpError(403, httpStatus.FAIL, "Reset password token expired");

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetTokenHash: null,
        passwordResetTokenExpiresAt: null,
      },
    });
  }

  static async refreshToken(refreshToken: string) {
    if (!refreshToken)
      throw new HttpError(401, httpStatus.FAIL, "No token provided");

    const { id } = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user || hashToken(refreshToken) !== user.refreshTokenHash)
      throw new HttpError(400, httpStatus.FAIL, "Invalid token provided");
    if (user.status !== UserStatus.ACTIVE)
      throw new HttpError(403, httpStatus.FAIL, "User account must be active");

    const expiresAt = user.refreshTokenExpiresAt;
    if (!expiresAt || expiresAt <= new Date())
      throw new HttpError(400, httpStatus.FAIL, "Refresh token expired");

    const {
      token,
      refreshExpiryAtInMS,
      refreshToken: newRefreshToken,
    } = this.generateUserTokens(user.id, user.role);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: hashToken(newRefreshToken),
        refreshTokenExpiresAt: calcExpiryFromMs(refreshExpiryAtInMS),
      },
    });

    return { token, refreshToken: newRefreshToken };
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
    if (!user) throw new HttpError(404, httpStatus.FAIL, "User not found");
    if (user.email !== email)
      throw new HttpError(400, httpStatus.FAIL, "Token mismatch!");
    if (user.status !== UserStatus.PENDING)
      throw new HttpError(400, httpStatus.FAIL, "User already active");

    const { token, refreshToken, refreshExpiryAtInMS } =
      this.generateUserTokens(user.id, user.role);

    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        status: UserStatus.ACTIVE,
        refreshTokenHash: hashToken(refreshToken),
        refreshTokenExpiresAt: calcExpiryFromMs(refreshExpiryAtInMS),
      },
      omit: { password: true },
    });

    return { user, token, refreshToken };
  }

  static async getCurrentUser(accessToken?: string) {
    if (!accessToken)
      throw new HttpError(404, httpStatus.FAIL, "No token provided");

    const { id } = verifyToken(accessToken);
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user)
      throw new HttpError(401, httpStatus.FAIL, "Invalid token provided");

    return user;
  }

  static generateUserTokens(id: string, role: UserRole) {
    const token = generateAccessToken(id, role);
    const refreshToken = generateRefreshToken(id);
    const refreshExpiryAtInMS = 7 * 24 * 60 * 60 * 1000;
    return { token, refreshToken, refreshExpiryAtInMS };
  }
}
