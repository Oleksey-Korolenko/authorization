import * as mongoDB from 'mongodb';
import { IUser, User } from '../user';

const generateObjectId = (): mongoDB.ObjectId => {
  return mongoDB.ObjectId.createFromTime(
    Math.round(new Date().getTime() / 1000)
  );
};

export const collections: {
  users?: mongoDB.Collection<IUser>;
  generateObjectId: typeof generateObjectId;
} = {
  generateObjectId,
};

export const connectToDatabase = async () => {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING ?? ''
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  console.log(`Successfully connected to database: ${db.databaseName}`);

  const existCollections = await db.listCollections().toArray();

  collections.users = await prepareCollection<IUser>(
    db,
    User.getSchema(),
    process.env.USER_COLL_NAME ?? '',
    existCollections
  );
};

const prepareCollection = async <T>(
  db: mongoDB.Db,
  schema: mongoDB.Document,
  name: string,
  existCollections: (
    | mongoDB.CollectionInfo
    | Pick<mongoDB.CollectionInfo, 'name' | 'type'>
  )[]
): Promise<mongoDB.Collection<T>> => {
  const existCollection = existCollections.find((it) => it.name === name);

  if (!existCollection) {
    await db.createCollection<T>(name);
  }

  await db.command(schema);

  const collection = db.collection<T>(name);

  console.log(`Collection ${name} successfully added!`);

  return collection;
};
