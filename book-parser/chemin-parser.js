import { book } from "./books/book-chemin.js";
import rightFile from "fs";

const split = book.split(/(Chemin,[^,]+, \d*)/);

let parWithSpace = [];
let bookArray = [];

let body = "";

let currentChapter = "";

for (let line of split) {
  if (line.length > 0 && (body.length === 0 || currentChapter.length === 0)) {
    if (line.includes("Chemin")) {
      currentChapter = line.replace("Chemin,", "");
    } else {
      body = line.replace("\n", "").replace(/^\d*/, "").replace(/(\\n)/g, " ");
    }
  } else {
    bookArray.push({ title: currentChapter, content: body });
    body = "";
    currentChapter = "";
  }
}

/* rightFile.writeFileSync(
  "export.js",
  `const sections = ${JSON.stringify(bookArray)}
  
  const book = {
    title: "L'imitation de Jésus-Christ",
    author: "Thomas à Kempis",
    sections,
  };
  
  const book2 = {
    title: "Another book",
    author: "Another author",
    sections: [
      {
        title: "De la sainte voie de la Croix",
        content: "S'il y avait eu pour l'homme quelque chose de meilleur et de plus utile que de souffrir, Jésus-Christ nous l'aurait appris par ses paroles et par son exemple.",
      },
      {
        title: "De la sainte voie de la Croix",
  
        content: "S'il y avait eu pour l'homme quelque chose de meilleur et de plus utile que de souffrir, Jésus-Christ nous l'aurait appris par ses paroles et par son exemple.",
      },
    ],
  };
  
  const book3 = {
    title: "Blabla",
    author: "JJ Goldman",
    sections: [
      {
        title: "De la sainte voie de la Croix",
        content: "S'il y avait eu pour l'homme quelque chose de meilleur et de plus utile que de souffrir, Jésus-Christ nous l'aurait appris par ses paroles et par son exemple.",
      },
      {
        title: "De la sainte voie de la Croix",
  
        content: "S'il y avait eu pour l'homme quelque chose de meilleur et de plus utile que de souffrir, Jésus-Christ nous l'aurait appris par ses paroles et par son exemple.",
      },
    ],
  };
  
  const books = [book, book2, book3];
  module.exports = { books };`
); */

const result = {
  title: "Chemin",
  author: "JoseMaria Escriva",
  sections: bookArray,
};

export default result;
