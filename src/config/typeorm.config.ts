import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const typeOrmconfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: 'localhost',
    port: 12720,

};