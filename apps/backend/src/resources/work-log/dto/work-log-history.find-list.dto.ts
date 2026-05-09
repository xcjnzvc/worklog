import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Property } from 'ts-deco';

export class WorkLogHistoryFindListDto extends PaginationDto {
  @Property({
    type: String,
    description: 'The user ID',
    required: true,
  })
  userId: string;
}
