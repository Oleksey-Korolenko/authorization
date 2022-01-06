import { Document, ObjectId } from 'mongodb';

export class User {
  constructor(
    public email: string,
    public password: string,
    public _id: ObjectId
  ) {}

  static getSchema(): Document {
    return {
      collMod: process.env.USER_COLL_NAME,
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'password'],
          additionalProperties: false,
          properties: {
            _id: {},
            email: {
              bsonType: 'string',
              description: "'email' is required and is a string",
            },
            password: {
              bsonType: 'string',
              description: "'password' is required and is a string",
            },
          },
        },
      },
    };
  }
}
