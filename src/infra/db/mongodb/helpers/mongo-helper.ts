import { Collection, MongoClient } from 'mongodb';
import { getEnv } from '../../../../util/env-helper';

export const MongoHelper = {
  connection: (null as unknown) as MongoClient,
  async connect() {
    const uri = getEnv('MONGO_URL');
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
