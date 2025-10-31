import { AppDataSource } from 'db/datasource';
import { UserEntity } from '../db/entities/user.entity';
import { tokenService } from "./token.service";
import { HttpException } from "exceptions";
import bcrypt from 'bcrypt';

const userRepo = AppDataSource.getRepository(UserEntity);

async function signup(identifier: string, password: string) {
  const existing = await userRepo.findOneBy({ identifier });
  if (existing) throw new HttpException(409, 'User already exists');

  const hash = await bcrypt.hash(password, 10);

  const user = userRepo.create({ identifier, password: hash });
  await userRepo.save(user);

  return await tokenService.issueTokens(user);
}

async function signin(identifier: string, password: string) {
  const user = await userRepo.findOneBy({ identifier });
  if (!user) throw new HttpException(401, 'Authentication failed');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new HttpException(401, 'Authentication failed');

  return await tokenService.issueTokens(user);
}

async function logout(refreshToken: string) {
  await tokenService.revokeToken(refreshToken);
}

export const authService = { signup, signin, logout };
