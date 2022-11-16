const app = require("express")();
const { v4 } = require("uuid");
const prisma = require("../client");

app.use(express.json());

app.get("/api", async (req, res) => {
  res.end("Hello World");
});

app.get("/api/books", async (req, res) => {
  try {
    const books = await prisma.book.findMany();

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = app;
