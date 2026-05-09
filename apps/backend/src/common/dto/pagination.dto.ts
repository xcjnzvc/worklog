import { Property } from 'ts-deco';

export class PaginationDto {
  @Property({
    type: Number,
    description: 'The page number',
    required: true,
    default: 1,
  })
  page: number;

  @Property({
    type: Number,
    description: 'The page size',
    required: true,
    default: 10,
  })
  limit: number;
}
