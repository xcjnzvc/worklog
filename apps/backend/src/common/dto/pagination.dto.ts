import { Property } from 'ts-deco';

export class PaginationDto {
  @Property({
    type: Number,
    description: 'The page number',
    required: true,
  })
  page: number;

  @Property({
    type: Number,
    description: 'The page size',
    required: true,
  })
  limit: number;
}
