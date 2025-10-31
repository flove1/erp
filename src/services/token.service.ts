import config from 'config';
import { UserEntity } from 'db/entities/user.entity';
import { parseDuration } from 'utils/parse-duration';
import { AppDataSource } from 'db/datasource';
import { TokenEntity } from 'db/entities/token.entity';
import jwt from 'jsonwebtoken';

const tokenRepo = AppDataSource.getRepository(TokenEntity);

async function issueTokens(user: UserEntity): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = { id: user.id, identifier: user.identifier };

  const accessExpiry = parseDuration(config.JWT.ACCESS_TOKEN_EXPIRY);
  const refreshExpiry = parseDuration(config.JWT.REFRESH_TOKEN_EXPIRY);

  const accessTokenPlaintext = jwt.sign(payload, config.JWT.SECRET, { expiresIn: accessExpiry });
  const refreshTokenPlaintext = jwt.sign(payload, config.JWT.SECRET, { expiresIn: refreshExpiry });

  const refreshTokenEntity = tokenRepo.create({
    token: refreshTokenPlaintext,
    user,
    expiresAt: new Date(Date.now() + refreshExpiry),
  });

  await tokenRepo.save(refreshTokenEntity);

  return { accessToken: accessTokenPlaintext, refreshToken: refreshTokenPlaintext };
}

async function refreshToken(token: string): Promise<ReturnType<typeof issueTokens>> {
  const tokenEntity = await tokenRepo.findOne({
    where: { token, isRevoked: false },
    relations: ['user'],
  });

  if (!tokenEntity) throw new Error('Invalid refresh token');
  if (tokenEntity.expiresAt && tokenEntity.expiresAt < new Date())
    throw new Error('Refresh token expired');

  tokenEntity.isRevoked = true;

  await tokenRepo.save(tokenEntity);

  return await issueTokens(tokenEntity.user);
}

async function revokeToken(token: string): Promise<void> {
  const tokenEntity = await tokenRepo.findOneBy({ token });
  if (!tokenEntity) throw new Error('Token not found');

  tokenEntity.isRevoked = true;

  await tokenRepo.save(tokenEntity);
}

export const tokenService = { issueTokens, refreshToken, revokeToken };
