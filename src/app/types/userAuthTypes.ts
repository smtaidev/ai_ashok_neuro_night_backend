import { Types } from "mongoose"

export interface IJwtPayload{
    email: string,
    userName: string
    role: string,
    companyName: string,
    companyRole: string
}

export interface IAuth{
    email: string,
    password: string
}