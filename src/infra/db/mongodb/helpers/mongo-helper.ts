import { Collection, MongoClient } from 'mongodb';
import { getEnv } from '../../../../util/env-helper';

export const MongoHelper = {
  connection: null as MongoClient | null,

  async connect() {
    const uri = getEnv('MONGO_URL');
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  async disconnect() {
    await this.connection?.close();
    this.connection = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.connection?.isConnected()) {
      await this.connect();
    }
    if (this.connection) {
      return this.connection.db().collection(name);
    } else {
      throw new Error('Invalid MongoClient connection');
    }
  },

  map(data: any): any {
    const { _id, ...dataWithoutId } = data;
    return Object.assign({}, dataWithoutId, { id: _id });
  }
};
