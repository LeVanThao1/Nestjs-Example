import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create_task.dto";
import { TaskStatus } from "./task.status.model";
import { GetTasksFilterDto } from "./dto/get_task_filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const {title, description} = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await Task.save(task);
        return task;
    }
    async getTasks(filterTask: GetTasksFilterDto) :Promise<Task[]> {
        const {status, search} = filterTask;
        const query = this.createQueryBuilder('task');
        if(status) {
            query.andWhere('task.status === :status', {status});
        }
        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search:`%${search}%`});
        }
        const tasks =  await query.getMany();
        return tasks;
    }
}