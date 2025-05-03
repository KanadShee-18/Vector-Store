import { Request, Response } from "express";
import NodeCache from "node-cache";
import { generateEmbedding } from "../lib/embedding";
import { VectorStore } from "../store";

const store = new VectorStore();
const cache = new NodeCache({ stdTTL: 100 });

export const addToStoreController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { content, metadata } = req.body;

    if (!content) {
      return res.status(402).json({
        success: false,
        message: "Content is mandatory for this request.",
      });
    }

    const contentToEmbedding = await generateEmbedding(content);

    if (!Array.isArray(contentToEmbedding)) {
      return res.status(400).json({
        error: "Vector is not good!",
      });
    }

    const id = store.addVector(contentToEmbedding, metadata);

    return res.status(200).json({
      success: true,
      message: "Vector added to store.",
      data: id,
    });
  } catch (error) {
    console.error("Error while adding vector embedding: ", error);
    return res.status(500).json({
      message: "Some error occurred while adding vector embedding!",
      success: false,
    });
  }
};

export const searchVector = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(402).json({
        success: false,
        message: "ID is required to get the vector.",
      });
    }

    const result = store.getVector(id);
    return res.status(200).json({
      success: true,
      message: "Vector has been found for this specific id.",
      data: result,
    });
  } catch (error) {
    console.error(`Error occurred while getting the vector: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Some error occurred while getting vector for its specific id.",
    });
  }
};

export const searchQueryInStore = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { query, threshold = 0, topK = 5 } = req.body;

    if (!query) {
      return res.status(402).json({
        success: false,
        message: "Query is missing in the request.",
      });
    }

    const cached = cache.get(
      `query:${query}&threshold:${threshold}&topK:${topK}`
    );

    if (cached) {
      return res.status(200).json({
        success: true,
        message: "Your query has been found in the vector store.",
        data: cached,
      });
    }

    const queryEmbedding = await generateEmbedding(query);

    if (!Array.isArray(queryEmbedding)) {
      return res.status(400).json({
        error: "Vector is not good!",
      });
    }

    const result = store.search(queryEmbedding, { threshold, topK });

    cache.set(`query:${query}&threshold:${threshold}&topK:${topK}`, result);

    return res.status(200).json({
      success: true,
      message: "Your query has been found in the vector store.",
      data: result,
    });
  } catch (error) {
    console.error(`Error while searching for query in store: ${error} ...`);

    return res.status(500).json({
      success: false,
      message: "Some error occurred while searching query in store.",
    });
  }
};
