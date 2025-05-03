import { generateEmbedding } from "../lib/embedding";
import { VectorStore } from "../store";

const store = new VectorStore();

async function similaritySearch(query: string): Promise<void> {
  try {
    const queryVector = await generateEmbedding(query);
    const results = store.search(queryVector, {
      topK: 3,
      threshold: 0.5
    });
    console.log(results, " found for the query");
  } catch (error) {
    console.error(error, " in searching the query in the vector store.");
  }
}

similaritySearch("This is a slice of cheese cake");