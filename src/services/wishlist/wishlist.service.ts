import prisma from '../../lib/prisma';
import ApiError from '../../utils/ApiError';

const addToWishlist = async (userId: string, productId: string) => {
  const product = await prisma.product.findFirst({ where: { id: productId, isDeleted: false } });
  if (!product) throw new ApiError(404, 'Product not found');

  const existing = await prisma.wishlist.findFirst({ where: { userId, productId, isDeleted: false } });
  if (existing) throw new ApiError(409, 'Product already in your wishlist');

  return prisma.wishlist.create({ data: { userId, productId }, include: { product: true } });
};

const getMyWishlist = async (userId: string) => {
  return prisma.wishlist.findMany({
    where: { userId, isDeleted: false },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const removeFromWishlist = async (userId: string, id: string) => {
  const item = await prisma.wishlist.findFirst({ where: { id, userId, isDeleted: false } });
  if (!item) throw new ApiError(404, 'Wishlist item not found');
  return prisma.wishlist.update({ where: { id }, data: { isDeleted: true } });
};

export const WishlistService = { addToWishlist, getMyWishlist, removeFromWishlist };
