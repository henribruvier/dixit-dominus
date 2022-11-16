import express from "express";
import prisma from "./client"; // importing the prisma instance we created.

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get("/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany();

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
