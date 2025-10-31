import { Request, Response } from 'express';
import { ApiResponse } from 'responses';
import { authService } from 'services/auth.service';
import { tokenService } from 'services/token.service';
import { authSchemas } from './auth.schemas';
import { HttpException } from 'exceptions';
import z from 'zod';

const refreshTokenCookie = "refreshToken";

async function signup(req: Request, res: Response<z.infer<typeof authSchemas.tokensResponseSchema>>) {
  const body = authSchemas.signupRequestSchema.parse(req.body);
  const tokens = await authService.signup(body.id, body.password);

  res.cookie(refreshTokenCookie, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "refresh",
  });

  const sanitized = authSchemas.tokensResponseSchema.parse(tokens);

  res.json(sanitized);
}

async function signin(req: Request, res: Response<z.infer<typeof authSchemas.tokensResponseSchema>>) {
  const body = authSchemas.signinRequestSchema.parse(req.body);
  const tokens = await authService.signin(body.id, body.password);

  res.cookie(refreshTokenCookie, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "refresh",
  });

  const sanitized = authSchemas.tokensResponseSchema.parse(tokens);

  res.json(sanitized);
}

async function refreshToken(req: Request, res: Response<z.infer<typeof authSchemas.tokensResponseSchema>>) {
  const refreshToken =
    authSchemas.refreshTokenSchema.safeParse(req.body).data?.refreshToken ??
    req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new HttpException(401, 'No refreshToken in cookies or body is provided');
  }

  const tokens = await tokenService.refreshToken(refreshToken);

  res.cookie(refreshTokenCookie, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "refresh",
  });

  const sanitized = authSchemas.tokensResponseSchema.parse(tokens);

  res.json(sanitized);
}

async function info(req: Request, res: Response<z.infer<typeof authSchemas.infoResponseSchema>>) {
  const sanitized = authSchemas.infoResponseSchema.parse({ id: req.user!.id });

  res.json(sanitized);
}

async function logout(req: Request, res: Response<ApiResponse>) {
  const refreshToken =
    authSchemas.refreshTokenSchema.safeParse(req.body).data?.refreshToken ??
    req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new HttpException(401, 'No refreshToken in cookies or body is provided');
  }

  res.clearCookie(refreshTokenCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  await authService.logout(refreshToken);

  res.sendStatus(200);
}

export const authController = { signup, signin, refreshToken, info, logout };
