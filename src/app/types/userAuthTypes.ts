import { Types } from "mongoose"

export interface IJwtPayload{
    email: string,
    userName: string
    role: string,
    companyName: string,
    companyRole: string,
    userId:Types.ObjectId
}

export interface IAuth{
    email: string,
    password: string
}