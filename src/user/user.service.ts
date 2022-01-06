import { ObjectId } from 'mongodb';
import { IUserWithoutId, User } from '.';
import { collections } from '../db';

export default class UserService {
  private _collection;

  private _generateObjectId;

  constructor() {
    this._collection = collections.users;
    this._generateObjectId = collections.generateObjectId;
  }

  public findOne = async (email: string): Promise<User | null> => {
    return this._collection?.findOne({
      email,
    }) as Promise<User | null>;
  };

  public findById = async (id: ObjectId): Promise<User | null> => {
    return this._collection?.findOne({
      _id: id,
    }) as Promise<User | null>;
  };

  public insertOne = async (user: IUserWithoutId): Promise<User | null> => {
    const existUser = await this.findOne(user.email);

    if (existUser !== null) {
      throw new Error(`User: [${user.email}] already exist`);
    }

    const _id = this._generateObjectId();

    const response = await this._collection?.insertOne({
      ...user,
      _id,
    } as User);

    if (response?.insertedId === undefined) {
      return null;
    }

    return this.findById(response.insertedId);
  };
}
