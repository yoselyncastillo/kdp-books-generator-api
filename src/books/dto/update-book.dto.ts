import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsOptional, IsArray, IsObject, IsString } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsString()
  @IsOptional()
  status?: 'draft' | 'ready_for_kdp' | 'published';

  @IsArray()
  @IsOptional()
  puzzleData?: Array<Record<string, any>>;
}
