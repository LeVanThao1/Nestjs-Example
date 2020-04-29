import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]

    transform(value: any) {
        value = value.toUpperCase();
        if(!this.isValidation(value)) {
            throw new BadRequestException(`${value} is an invalid status`)
        }
        return value;
    }

    private isValidation(status: any) {
        const found = this.allowStatus.indexOf(status);
        return found !== -1;
    } 
}