import prisma from '../../lib/prisma';
import ApiError from '../../utils/ApiError';
import { Prisma } from '@prisma/client';

const createCategory = async (payload: { name: string; description?: string }) => {
  const existing = await prisma.category.findUnique({ where: { name: payload.name } });
  if (existing) throw new ApiError(409, 'Category with this name already exists');
  return prisma.category.create({ data: payload });
};

const getAllCategories = async (query: { search?: string; page?: string; limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.CategoryWhereInput = {
    isDeleted: false,
    ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {}),
  };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.category.count({ where }),
  ]);

  return { meta: { page, limit, total }, data: categories };
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({ where: { id, isDeleted: false } });
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
};

const updateCategory = async (id: string, payload: Partial<{ name: string; description: string }>) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data: payload });
};

const softDeleteCategory = async (id: string) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data: { isDeleted: true } });
};

export const CategoryService = { createCategory, getAllCategories, getCategoryById, updateCategory, softDeleteCategory };
