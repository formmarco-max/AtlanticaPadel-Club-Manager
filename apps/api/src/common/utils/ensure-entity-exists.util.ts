import { NotFoundException } from '@nestjs/common';

export async function ensureEntityExists<T>(
  findEntity: () => Promise<T | null>,
  message: string,
): Promise<T> {
  const entity = await findEntity();

  if (!entity) {
    throw new NotFoundException(message);
  }

  return entity;
}