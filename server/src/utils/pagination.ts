import { Request } from "express";

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (req: Request, defaultLimit = 20): PaginationQuery => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const paginatedResponse = (data: any[], total: number, pagination: PaginationQuery) => {
  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
      hasNext: pagination.page * pagination.limit < total,
      hasPrev: pagination.page > 1,
    },
  };
};
