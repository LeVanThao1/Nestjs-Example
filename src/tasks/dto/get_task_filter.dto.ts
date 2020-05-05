
import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task.status.model";

export class GetTasksFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}