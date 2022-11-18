import {PrismaClient} from '@prisma/client';
import {books} from './index.js';

const prisma = new PrismaClient();

const main = async () => {
	await prisma.section.deleteMany();
	await prisma.book.deleteMany();

	books.forEach(async book =>
		prisma.book.create({
			data: {
				title: book.title,
				author: book.author,
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
		}),
	);
};

main();
