import { ApiProperty } from '@nestjs/swagger';
import { Property } from 'ts-deco';

class Metadata {
  @Property({
    type: Number,
    description: 'The total number of pages',
    required: true,
  })
  totalPages: number;

  @Property({
    type: Number,
    description: 'The current page',
    required: true,
  })
  currentPage: number;

  @Property({
    type: Number,
    description: 'The limit of the response',
    required: true,
  })
  limit: number;

  @Property({
    type: Number,
    description: 'The total number of items',
    required: true,
  })
  totalCount: number;
}

export class ResponseWithMetaData {
  @ApiProperty({
    type: Metadata,
    description: 'The metadata of the response',
    required: true,
  })
  metadata: Metadata;
}
