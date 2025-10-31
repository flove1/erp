import { Request, Response } from 'express';
import { ApiResponse } from 'responses';
import { authService } from 'services/auth.service';
import { tokenService } from 'services/token.service';
import { authSchemas } from "./auth.schemas";

async function signup(req: Request, res: Response<ApiResponse>) {
  const body = authSchemas.SignupSchema.parse(req.body);
  const tokens = await authService.signup(body.id, body.password);
  res.json({ data: tokens });
}

async function signin(req: Request, res: Response<ApiResponse>) {
  const body = authSchemas.SigninSchema.parse(req.body);
  const tokens = await authService.signin(body.id, body.password);
  res.json({ data: tokens });
}

async function refreshToken(req: Request, res: Response<ApiResponse>) {
  try {
    const body = authSchemas.RefreshTokenSchema.parse(req.body);
    const tokens = await tokenService.refreshToken(body.refreshToken);
    res.json({ data: tokens });
  } catch (e: any) {
    res.status(400).json({ errors: e.message });
  }
}

async function info(req: Request, res: Response<ApiResponse>) {
  res.json({ data: { id: req.user.id } });
}

async function logout(req: Request, res: Response<ApiResponse>) {
  try {
    const body = authSchemas.LogoutSchema.parse(req.body);
    await authService.logout(body.refreshToken);
    res.json({ data: { success: true } });
  } catch (e: any) {
    res.status(400).json({ errors: e.message });
  }
}

export const authController = { signup, signin, refreshToken, info, logout };
