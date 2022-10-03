import { Repository } from 'typeorm';


export class BaseCrudService<Entity> {
    constructor(protected readonly repository: Repository<any>){}

    create (createDto: any): Promise<Entity> {
        return this.repository.save(createDto) as Promise<Entity>
    }

    findAll (): Promise<Entity[]> {
        return this.repository.find() as Promise<Entity[]>
    }

    findOne (id: string): Promise<Entity> {
        return this.repository.findOneBy({ id }) as Promise<Entity>
    }

    update (id: string, updateDto: any) {
        return this.repository.update(id, updateDto)
    }

    remove (id: string) {
        return this.repository.delete(id)
    }
}
