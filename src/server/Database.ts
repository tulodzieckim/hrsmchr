import { Db, MongoClient, InsertOneWriteOpResult, UpdateWriteOpResult, InsertWriteOpResult } from 'mongodb'

export interface IDatabase {
  init(): Promise<void>
  find(collectionName: string, query: Object, fields?: Object): Promise<any[]>
  findOne(collectionName: string, filter: Object): Promise<any>
  updateOne(collectionName: string, filter: Object, update: Object): Promise<UpdateWriteOpResult>
  insertOne(collectionName: string, doc: Object): Promise<InsertOneWriteOpResult>
  insertMany(collectionName: string, docs: Object): Promise<InsertWriteOpResult>
}

export interface Config {
  uri: string
  dbName: string
}

export class Database implements IDatabase {

  protected db: Db;

  constructor(protected config: Config) {
  }

  async init() {
    let client = await MongoClient.connect(this.config.uri);
    this.db = client.db(this.config.dbName);
    console.log(`connected to database: ${this.config.uri}`)
  }


  find(collectionName: string, query?: Object) {
    return this.db.collection(collectionName).find(query).toArray()
  }

  findOne(collectionName: string, filter: Object) {
    return this.db.collection(collectionName).findOne(filter)
  }

  updateOne(collectionName: string, filter: Object, update: Object) {
    return this.db.collection(collectionName).updateOne(filter, update)
  }

  insertOne(collectionName: string, doc: Object) {
    return this.db.collection(collectionName).insertOne(doc)
  }

  insertMany(collectionName: string, docs: Object[]) {
    return this.db.collection(collectionName).insertMany(docs)
  }

  //deleteOne deleteMany  http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#deleteOne

}
