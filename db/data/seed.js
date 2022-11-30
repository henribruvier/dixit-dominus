const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const FORCE_PUSH = false;

const main = async books => {
	if (FORCE_PUSH) await prisma.section.deleteMany();
	if (FORCE_PUSH) await prisma.book.deleteMany();
	const booksInDb = await prisma.book.findMany();

	books
		.filter(currentBook => {
			const skip = booksInDb.find(book => book.title === currentBook.title);
			if (skip) console.log(`Skipping ${currentBook.title}`);
			return !skip;
		})
		.forEach(async book => {
			console.log(book.title, 'will be added...');
			const Book = await prisma.book.create({
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
			console.log(Book.title, 'added to db!');
		});
};

(async () => {
	const {books} = await import('./books.mjs');
	main(books);
})().catch(err => console.error(err));
