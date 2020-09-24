import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  connection: (null as unknown) as MongoClient,
  async connect() {
    const uri: string = process.env.MONGO_URL ?? '';
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  async disconnect() {
    await this.connection.close();
  },

  getCollection(name: string): Collection {
    return this.connection.db().collection(name);
  },

  map(data: any): any {
    const { _id, ...dataWithoutId } = data;
    return Object.assign({}, dataWithoutId, { id: _id });
  }
};
