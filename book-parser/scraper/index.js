import {appendFile, writeFile} from 'fs/promises';
import jsdom from 'jsdom';

const getDom = async psalmNumber => {
	const res = await fetch(`https://www.aelf.org/bible/Ps/${psalmNumber}`);
	const text = await res.text();
	const dom = new jsdom.JSDOM(text);
	return dom;
};

await writeFile(
	'psalms.txt',
	`const book2 = {
	title: 'Livre des Psaumes',
	author: 'Le Seigneur',
	image: 'https://m.media-amazon.com/images/I/81tOut+i4CL.jpg',
	sections: [
`,
);

const numbers = Array.from(Array(150).keys()).map(i => i + 1);
numbers.splice(8, 1);
numbers.splice(8, 0, '9A', '9B');
numbers.splice(113, 1);
numbers.splice(113, 0, '113A', '113B');

for (const psalmNumber of numbers) {
	const dom = await getDom(psalmNumber);
	const content = dom.window.document.querySelector('.block-single-reading');
	const title = content.querySelector('h1');
	const verses = content.querySelectorAll('p');
	const text = Array.from(verses)
		.map(verse => verse.textContent)
		.join('\n');
	await appendFile(
		'psalms.txt',
		`{ title: "${title.textContent}",
    content: \`${text}\`},`,
	);
}

await appendFile('psalms.txt', `], };\n`);
