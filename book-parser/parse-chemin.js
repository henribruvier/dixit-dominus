import {appendFile, writeFile} from 'fs/promises';
import {book} from './books/chemin.js';

const split = book
	.split(/(Chemin,[^,]+, \d*)/g)
	.filter(line => line !== ('\n' || '\n\n' || '\n\n ' || '' || ' '));

let bookArray = [];
let body = '';
let currentChapter = '';

split.forEach(line => {
	if (line.length < 3) {
		return;
	}
	if (currentChapter === '' && line.includes('Chemin')) {
		currentChapter = line;
		return;
	}
	body = line.replace('\n', '').replace(/^\d*/g, '').replace(/(\\n)/g, ' ');

	if (currentChapter.length > 0 && body.length > 0)
		bookArray.push({title: currentChapter, content: body});

	body = '';
	currentChapter = '';
});

const result = {
	title: 'Chemin',
	author: 'José-Maria Escriva',
	image:
		'https://res.cloudinary.com/dklaggsnl/image/upload/v1669371836/chemin_i3porf.jpg',
	sections: bookArray,
};

await writeFile('export/chemin.js', 'export const book0 =');
await appendFile('export/chemin.js', JSON.stringify(result));
