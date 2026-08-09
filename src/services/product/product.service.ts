import prisma from '../../lib/prisma';
import ApiError from '../../utils/ApiError';
import { Prisma } from '@prisma/client';

const createProduct = async (payload: Prisma.ProductUncheckedCreateInput) => {
  const category = await prisma.category.findFirst({ where: { id: payload.categoryId, isDeleted: false } });
  if (!category) throw new ApiError(404, 'Category not found');
  return prisma.product.create({ data: payload, include: { category: true } });
};

const getAllProducts = async (query: {
  search?: string;
  categoryId?: string;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    isDeleted: false,
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.status ? { status: query.status as any } : {}),
    ...(query.minPrice || query.maxPrice
      ? {
          price: {
            gte: query.minPrice ? Number(query.minPrice) : undefined,
            lte: query.maxPrice ? Number(query.maxPrice) : undefined,
          },
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { category: true } }),
    prisma.product.count({ where }),
  ]);

  return { meta: { page, limit, total }, data: products };
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, isDeleted: false },
    include: {
      category: true,
      reviews: { where: { isDeleted: false }, include: { user: { select: { id: true, name: true } } } },
    },
  });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

const updateProduct = async (id: string, payload: Partial<Prisma.ProductUncheckedUpdateInput>) => {
  await getProductById(id);
  return prisma.product.update({ where: { id }, data: payload, include: { category: true } });
};

const softDeleteProduct = async (id: string) => {
  await getProductById(id);
  return prisma.product.update({ where: { id }, data: { isDeleted: true } });
};

export const ProductService = { createProduct, getAllProducts, getProductById, updateProduct, softDeleteProduct };
