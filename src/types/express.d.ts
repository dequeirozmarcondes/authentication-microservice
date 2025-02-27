import { Types } from 'mongoose';

declare module 'express' {
    interface Request {
        user?: {
            id: Types.ObjectId | string;
        };
    }
}