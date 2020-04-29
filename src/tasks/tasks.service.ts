import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4  as uuidv4} from 'uuid';
import { CreateTaskDto } from './dto/create_task.dto';
import { GetTasksFilterDto } from './dto/get_task_filter.dto';

@Injectable()
export class TasksService {
    private tasks:Task[] = [];
    
    getAllTasks():Task[] {
        return this.tasks;
    }

    getTaskFilter(filterTask: GetTasksFilterDto) :Task[] {
        let tasks = this.getAllTasks();
        const {status, search} = filterTask;
        if(status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if(search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
        }
        return tasks;
    }
    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }
    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }
    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}
