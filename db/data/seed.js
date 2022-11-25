const { books } = require("./index.js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const main = async () => {
  await prisma.section.deleteMany();
  await prisma.book.deleteMany();

  books.forEach(async (book) =>
    prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        image: book.image,
        sections: {
          createMany: {
            data: book.sections.map((section, index) => ({
              title: section.title,
              content: section.content,
              order: index + 1,
            })),
          },
        },
      },
    })
  );
};

main();
