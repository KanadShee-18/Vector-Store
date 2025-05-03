import express from "express";
import {
  addToStoreController,
  searchQueryInStore,
  searchVector,
} from "./controllers/vector.controller";

const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());

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
