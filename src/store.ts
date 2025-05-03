import { v4 as uuidv4 } from "uuid";
import { cosineSimilarity, loadVectors, saveVectors } from "./utils";
import { VectorRecord, VectorSearchOptions, VectorStoreData } from "./types";

export class VectorStore {
  private store: VectorStoreData;

  constructor() {
    this.store = loadVectors();
  }

  addVector(vector: number[], metadata: Record<string, any> = {}) {
    const id = uuidv4();
    this.store[id] = { id, vector, metadata };
    saveVectors(this.store);
    return id;
  }

  getVector(id: string): VectorRecord | undefined {
    return this.store[id];
  }

  search(query: number[], options: VectorSearchOptions) {
    const threshold = options.threshold ?? 0;
    const topK = options.topK ?? Object.keys(this.store).length;

    const result = Object.values(this.store)
      .map((record) => ({
        id: record.id,
        score: cosineSimilarity(query, record.vector),
        metadata: record.metadata,
      }))
      .filter((r) => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return result;
  }
}
