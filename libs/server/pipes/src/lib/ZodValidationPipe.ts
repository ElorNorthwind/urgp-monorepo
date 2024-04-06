import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsed = this.schema.parse(value);
      return parsed;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
