import { ObjectId } from 'mongodb';

export interface IUser extends IUserWithoutId {
  _id: ObjectId;
}

export interface IUserWithoutId {
  email: string;
  password: string;
}
