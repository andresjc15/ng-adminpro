import { Hospital } from "./hospital.model";

interface _MedicoUser {
    _id: string;
    nombre: string;
    img: string;
}

export class Medico {

    constructor(
        public id: string,
        public nombre: string,
        public img?: string,
        public usuario?: _MedicoUser,
        public hospital?: Hospital,
    ) {}
}