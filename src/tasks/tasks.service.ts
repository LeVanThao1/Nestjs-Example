import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create_task.dto';
import { GetTasksFilterDto } from './dto/get_task_filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.model';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';

@Injectable()
@UseGuards(AuthGuard())
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTaskFilter(filterTask: GetTasksFilterDto, user: User) :Promise<Task[]> {
        return this.taskRepository.getTasks(filterTask, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if(!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return found;
    }
    

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    // async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    //     const {title, description} = createTaskDto;
    //     const task = new Task();
    //     task.title = title;
    //     task.description = description;
    //     task.status = TaskStatus.OPEN;
    //     await Task.save(task);
    //     return task;
    // }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });

        if(result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    // private tasks:Task[] = [];
    
    // getAllTasks():Task[] {
    //     return this.tasks;
    // }

    // getTaskFilter(filterTask: GetTasksFilterDto) :Task[] {
    //     let tasks = this.getAllTasks();
    //     const {status, search} = filterTask;
    //     if(status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if(search) {
    //         tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
    //     }
    //     return tasks;
    // }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuidv4(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     }
    //     this.tasks.push(task);
    //     return task;
    // }
    
    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);
    //     if(!found) {
    //         throw new NotFoundException(`Task with ID ${id} not found`);
    //     }
    //     return found;
    // }

    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }

    // deleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    // }
}
