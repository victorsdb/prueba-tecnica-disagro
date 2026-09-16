import type { Request, Response } from "express";
import { getActiveProducts } from "../services/product.service";

export const getProducts = async (_req: Request, res: Response) => {
  const products = await getActiveProducts();

  res.json(products);
};