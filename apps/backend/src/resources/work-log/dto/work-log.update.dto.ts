import { Property } from "ts-deco";

export class WorkLogUpdateDto {
  @Property({
    type: String,
    description: '수정 사유',
    required: true,
  })
  reason: string;
}