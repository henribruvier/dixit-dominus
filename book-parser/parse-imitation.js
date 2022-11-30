import {appendFile, writeFile} from 'fs/promises';
import {book} from './books/imitation.js';

const split = book.split('\n');
let bookArray = [];
let body = '';
let currentChapter = '';

for (let line of split) {
	if (line.length > 0) {
		if (body.length === 0 && currentChapter.length === 0) {
			currentChapter = line.replace(/\d+./, '');
		} else {
			body += line;
		}
	} else {
		if (body.length === 0 || currentChapter.length === 0) continue;

		const chapters = body.split(/\d+./);
		for (let chapter of chapters) {
			if (chapter.length === 0) continue;
			bookArray.push({title: currentChapter, content: chapter});
		}
		body = '';
		currentChapter = '';
	}
}

const result = {
	title: "L'imitation de Jésus-Christ",
	author: 'Thomas à Kempis',
	image:
		'https://res.cloudinary.com/dklaggsnl/image/upload/v1669027352/imitation-de-jesus-christ_av4deq.jpg',
	sections: bookArray,
};

await writeFile('export/imitation.js', 'export const book1 =');
await appendFile('export/imitation.js', JSON.stringify(result));
