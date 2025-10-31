import { Request, Response } from 'express';
import { ApiResponse } from 'responses';
import { authService } from 'services/auth.service';
import { tokenService } from 'services/token.service';
import { authSchemas } from './auth.schemas';
import z from 'zod';
import { HttpException } from 'exceptions';

const refreshTokenCookie = "refreshToken";

async function signup(req: Request, res: Response<z.infer<typeof authSchemas.tokensResponseSchema>>) {
  const body = authSchemas.signupRequestSchema.parse(req.body);
  const tokens = await authService.signup(body.id, body.password);

  res.cookie(refreshTokenCookie, refreshToken, {
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

  res.cookie(refreshTokenCookie, refreshToken, {
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
    req.cookies?.refreshToken ??
    authSchemas.refreshTokenSchema.safeParse(req.body).data?.refreshToken;

  if (!refreshToken) {
    throw new HttpException(401, 'No refresh token in cookies provided');
  }

  const tokens = await tokenService.refreshToken(refreshToken);

  res.cookie(refreshTokenCookie, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "refresh",
  });

  const sanitized = authSchemas.tokensResponseSchema.parse(tokens);

  res.json(sanitized);
}

async function info(req: Request, res: Response<z.infer<typeof authSchemas.infoResponseSchema>>) {
  const sanitized = authSchemas.infoResponseSchema.parse({ id: req.user.id });

  res.json(sanitized);
}

async function logout(req: Request, res: Response<ApiResponse>) {
  const body = authSchemas.logoutRequestSchema.parse(req.body);

  res.clearCookie(refreshTokenCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  await authService.logout(body.refreshToken);
}

export const authController = { signup, signin, refreshToken, info, logout };
