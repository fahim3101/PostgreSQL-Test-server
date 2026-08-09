import prisma from '../../lib/prisma';
import ApiError from '../../utils/ApiError';

const createReview = async (userId: string, payload: { productId: string; rating: number; comment?: string }) => {
  const product = await prisma.product.findFirst({ where: { id: payload.productId, isDeleted: false } });
  if (!product) throw new ApiError(404, 'Product not found');

  const existing = await prisma.review.findFirst({ where: { userId, productId: payload.productId, isDeleted: false } });
  if (existing) throw new ApiError(409, 'You have already reviewed this product');

  return prisma.review.create({
    data: { userId, productId: payload.productId, rating: payload.rating, comment: payload.comment },
    include: { user: { select: { id: true, name: true } } },
  });
};

const getAllReviews = async (query: { productId?: string; page?: string; limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { isDeleted: false, ...(query.productId ? { productId: query.productId } : {}) };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } }, product: { select: { id: true, title: true } } },
    }),
    prisma.review.count({ where }),
  ]);

  return { meta: { page, limit, total }, data: reviews };
};

const getReviewById = async (id: string) => {
  const review = await prisma.review.findFirst({
    where: { id, isDeleted: false },
    include: { user: { select: { id: true, name: true } }, product: true },
  });
  if (!review) throw new ApiError(404, 'Review not found');
  return review;
};

const updateReview = async (id: string, userId: string, payload: Partial<{ rating: number; comment: string }>) => {
  const review = await getReviewById(id);
  if (review.userId !== userId) throw new ApiError(403, 'You can only update your own review');
  return prisma.review.update({ where: { id }, data: payload });
};

const softDeleteReview = async (id: string, userId: string, isAdmin: boolean) => {
  const review = await getReviewById(id);
  if (!isAdmin && review.userId !== userId) throw new ApiError(403, 'You can only delete your own review');
  return prisma.review.update({ where: { id }, data: { isDeleted: true } });
};

export const ReviewService = { createReview, getAllReviews, getReviewById, updateReview, softDeleteReview };
