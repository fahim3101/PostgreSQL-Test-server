import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import config from '../../config';
import ApiError from '../../utils/ApiError';

const generateToken = (payload: { id: string; email: string; role: string }) => {
  return jwt.sign(payload, config.jwt.secret as string, {
    expiresIn: config.jwt.expires_in,
  } as jwt.SignOptions);
};

const register = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new ApiError(409, 'A user with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, config.bcrypt_salt_rounds);

  const user = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user || user.isDeleted) {
    throw new ApiError(404, 'No account found with this email');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Incorrect password');
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const AuthService = { register, login };
