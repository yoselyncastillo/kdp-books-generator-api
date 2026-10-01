import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}
