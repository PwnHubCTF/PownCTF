import { Repository } from 'typeorm';


export class BaseCrudService<CreateCategoryDto,UpdateCategoryDto> {
    constructor(protected readonly repository: Repository<any>){}

    create (createDto: CreateCategoryDto) {
        return this.repository.save(createDto)
    }

    findAll () {
        return this.repository.find()
    }

    findOne (id: string) {
        return this.repository.findOneBy({ id })
    }

    update (id: string, updateDto: UpdateCategoryDto) {
        return this.repository.update(id, updateDto)
    }

    remove (id: string) {
        return this.repository.delete(id)
    }
}
