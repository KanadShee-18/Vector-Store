import express, { Request, Response } from "express";
import { generateEmbedding } from "./lib/embedding";
import { VectorStore } from "./store";
import NodeCache from "node-cache";
import {
  addToStoreController,
  searchQueryInStore,
  searchVector,
} from "./controllers/vector.controller";

const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());
const cache = new NodeCache({ stdTTL: 100 });
const store = new VectorStore();

// app.get("/", (req, res) => {
//   res.json({
//     message: "Hey There!",
//   });
// });

app.post("/add", addToStoreController);

app.get("/vector/:id", searchVector);

app.post("/search", searchQueryInStore);

app.listen(port, () => {
  console.log(`App is listening on PORT--${port} ...`);
});
