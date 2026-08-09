import prisma from '../../lib/prisma';
import ApiError from '../../utils/ApiError';
import { Prisma, Role } from '@prisma/client';

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const getAllUsers = async (query: { search?: string; page?: string; limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    isDeleted: false,
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: userSafeSelect }),
    prisma.user.count({ where }),
  ]);

  return { meta: { page, limit, total }, data: users };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({ where: { id, isDeleted: false }, select: userSafeSelect });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const updateUser = async (id: string, payload: Partial<{ name: string; phone: string; address: string }>) => {
  await getUserById(id);
  return prisma.user.update({ where: { id }, data: payload, select: userSafeSelect });
};

const changeUserRole = async (id: string, role: Role) => {
  await getUserById(id);
  return prisma.user.update({ where: { id }, data: { role }, select: userSafeSelect });
};

const softDeleteUser = async (id: string) => {
  await getUserById(id);
  return prisma.user.update({ where: { id }, data: { isDeleted: true }, select: userSafeSelect });
};

export const UserService = { getAllUsers, getUserById, updateUser, changeUserRole, softDeleteUser };
