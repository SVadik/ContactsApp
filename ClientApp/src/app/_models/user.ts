import { Role } from "./role";

export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    middlename: string;
    password: string;
    role: Role;
    token?: string;
}