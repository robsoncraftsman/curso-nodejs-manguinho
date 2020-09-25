import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient | null,
  url: '',

  async _createMongoClientConnection(url: string): Promise<MongoClient> {
    return await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  async connect(url: string) {
    this.url = url;
    this.client = await this._createMongoClientConnection(this.url);
  },

  async disconnect() {
    await this.client?.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      this.client = await this._createMongoClientConnection(this.url);
    }
    return this.client.db().collection(name);
  },

  map(data: any): any {
    const { _id, ...dataWithoutId } = data;
    return Object.assign({}, dataWithoutId, { id: _id });
  }
};
