import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create_task.dto';
import { GetTasksFilterDto } from './dto/get_task_filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}
    
    @Get()
    getAllTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        if(Object.keys(filterDto).length) 
            return this.tasksService.getTaskFilter(filterDto);
        return this.tasksService.getAllTasks();
    }

    @Post()
    createTasks(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get(':id') 
    getTaskById(@Param('id') id: string):Task {
        return this.tasksService.getTaskById(id);
    }

    @Patch(':id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus) :Task {
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string) {
        return this.tasksService.deleteTask(id);
    }
}
