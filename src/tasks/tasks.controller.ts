import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { GetTasksFilterDto } from './dto/get_task_filter.dto';
import { TaskStatusValidationPipe } from './pipes/task_status_validation_pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.model';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}
    
    @Get()
    getAllTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
        return this.tasksService.getTaskFilter(filterDto);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTasks(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get(':id') 
    getTaskById(@Param('id', ParseIntPipe) id: number):Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ) :Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.deleteTask(id);
    }
}
