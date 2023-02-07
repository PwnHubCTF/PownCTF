import { PartialType } from '@nestjs/mapped-types';
import { CreateDeployerDto } from './create-deployer.dto';

export class UpdateDeployerDto extends PartialType(CreateDeployerDto) { }
