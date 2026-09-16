import type { Request, Response } from "express";
import { getActiveServices } from "../services/service.service";

export const getServices = async (_req: Request, res: Response) => {
  const services = await getActiveServices();

  res.json(services);
};