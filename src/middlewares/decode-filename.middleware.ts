import { NextFunction, Request, Response } from 'express';

export function decodeFilenameMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.file && req.file.originalname) {
    req.file.originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
  }

  next();
}
