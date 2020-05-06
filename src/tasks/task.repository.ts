import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create_task.dto";
import { TaskStatus } from "./task.status.model";
import { GetTasksFilterDto } from "./dto/get_task_filter.dto";
import { User } from "src/auth/user.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    private logger = new Logger('TaskRepository');

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const {title, description} = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await Task.save(task);
        delete task.user;
        return task;
    }
    async getTasks(filterTask: GetTasksFilterDto, user: User) :Promise<Task[]> {
        const {status, search} = filterTask;
        const query = this.createQueryBuilder('task');
        query.where('task.userDd = :userId', {userDd: user.id})
        if(status) {
            query.andWhere('task.status = :status', {status});
        }
        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search:`%${search}%`});
        }
        try {
            const tasks =  await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Fail to get tasks for user "${user.username}, Filters: ${JSON.stringify(filterTask)}`, error.stack )
            throw new InternalServerErrorException();
        }
    }
}