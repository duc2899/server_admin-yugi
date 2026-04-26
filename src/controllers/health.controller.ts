import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/api-response";
import env from "../configs/env";
import mongoose from "mongoose";

export const healthCheck = async (req: Request, res: Response) => {
  return ApiResponse.Success(res, "Service is healthy", {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};


export const detailedHealthCheck = async (req: Request, res: Response) => {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      unit: "MB"
    },
    cpu: {
      usage: process.cpuUsage()
    }
  };

  return ApiResponse.Success(res, "Service is healthy", healthData);
};

export const checkDBHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.connection.db) {
      return ApiResponse.notFound(res, "Service is healthy", {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "MongoDB not connected"
      });
    }

    const result = await mongoose.connection.db.admin().ping();

    return ApiResponse.Success(res, "MongoDB is healthy", result);

  } catch (error) {
    next(error);
  }
};