import { PartialType } from '@nestjs/mapped-types';
import { CreateClassTestDto } from './create-class-test.dto';

export class UpdateClassTestDto extends PartialType(CreateClassTestDto) {}
