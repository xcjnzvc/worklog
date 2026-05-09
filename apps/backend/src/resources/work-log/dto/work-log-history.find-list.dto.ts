import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Property } from 'ts-deco';

export class WorkLogHistoryFindListMgmtDto extends PaginationDto {
  @Property({
    type: String,
    description: 'The user ID',
    isOptional: true,
    nullable: true,
  })
  userId?: string;
}

export class WorkLogHistoryFindListDto extends PaginationDto {}
