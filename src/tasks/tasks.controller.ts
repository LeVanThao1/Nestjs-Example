import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UsePipes, ValidationPipe, ParseIntPipe, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create_task.dto';
import { GetTasksFilterDto } from './dto/get_task_filter.dto';
import { TaskStatusValidationPipe } from './pipes/task_status_validation_pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.model';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
export class TasksController {
    private logger = new Logger('TasksController    ')
    constructor(private tasksService: TasksService) {}
    
    @Get()
    getAllTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks`);
        return this.tasksService.getTaskFilter(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTasks(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get(':id') 
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ):Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ) :Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Delete(':id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }
}
