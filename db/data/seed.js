const {books} = require('./index.js');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
	const booksInDb = await prisma.book.findMany();

	books
		.filter(
			currentBook => !booksInDb.find(book => book.title === currentBook.title),
		)
		.forEach(async book => {
			console.log('Adding book:', book.title);
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
			});
		});
};

main();
