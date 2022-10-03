import { SetMetadata } from '@nestjs/common';

export const CTF_STATE_KEY = 'state';
export const CtfState = (...states: string[]) => SetMetadata('state', states);