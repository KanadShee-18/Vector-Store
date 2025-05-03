import { generateEmbedding } from "../lib/embedding";
import { VectorStore } from "../store";

const store = new VectorStore();

async function processText(input: {
  text: string;
  metadata: any;
}): Promise<void> {
  try {
    const vectorEmbedding = await generateEmbedding(input.text);
    const id = store.addVector(vectorEmbedding, input.metadata);
    console.log("Added vector with id: ", id);
  } catch (error) {
    console.error("Adding vector in store failed: ", error);
  }
}

const input = {
  text: "This is a slice of cake",
  metadata: {
    title: "Cheesecake",
    description: "Here is a recipe for this amazing cheesecake",
  },
};

processText(input);
