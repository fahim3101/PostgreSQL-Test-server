import prisma from '../../lib/prisma';
import ApiError from '../../utils/ApiError';
import { OrderStatus } from '@prisma/client';

const createOrder = async (
  userId: string,
  payload: { shippingAddress?: string; items: { productId: string; quantity: number }[] }
) => {
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of payload.items) {
      const product = await tx.product.findFirst({ where: { id: item.productId, isDeleted: false } });
      if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);
      if (product.stock < item.quantity) throw new ApiError(400, `Insufficient stock for product: ${product.title}`);

      totalAmount += product.price * item.quantity;
      orderItemsData.push({ productId: product.id, quantity: item.quantity, price: product.price });

      await tx.product.update({ where: { id: product.id }, data: { stock: { decrement: item.quantity } } });
    }

    return tx.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress: payload.shippingAddress,
        items: { create: orderItemsData },
      },
      include: { items: { include: { product: true } } },
    });
  });
};

const getAllOrders = async (requester: { id: string; role: string }, query: { status?: string; page?: string; limit?: string }) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
    ...(requester.role !== 'ADMIN' ? { userId: requester.id } : {}),
    ...(query.status ? { status: query.status as OrderStatus } : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  return { meta: { page, limit, total }, data: orders };
};

const getOrderById = async (id: string, requester: { id: string; role: string }) => {
  const order = await prisma.order.findFirst({
    where: { id, isDeleted: false },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
  });
  if (!order) throw new ApiError(404, 'Order not found');
  if (requester.role !== 'ADMIN' && order.userId !== requester.id) throw new ApiError(403, 'You cannot access this order');
  return order;
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const order = await prisma.order.findFirst({ where: { id, isDeleted: false } });
  if (!order) throw new ApiError(404, 'Order not found');
  return prisma.order.update({ where: { id }, data: { status } });
};

const softDeleteOrder = async (id: string, requester: { id: string; role: string }) => {
  const order = await getOrderById(id, requester);
  return prisma.order.update({ where: { id: order.id }, data: { isDeleted: true } });
};

export const OrderService = { createOrder, getAllOrders, getOrderById, updateOrderStatus, softDeleteOrder };
