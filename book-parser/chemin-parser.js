import { book } from "./books/book-chemin.js";
import rightFile from "fs";

const split = book
  .split(/(Chemin,[^,]+, \d*)/g)
  .filter((line) => line !== ("\n" || "\n\n" || "\n\n " || "" || " "));

let parWithSpace = [];
let bookArray = [];

let body = "";

let currentChapter = "";

split.forEach((line) => {
  if (line.length < 3) {
    return;
  }
  if (currentChapter === "" && line.includes("Chemin")) {
    currentChapter = line;
    return;
  }
  body = line.replace("\n", "").replace(/^\d*/g, "").replace(/(\\n)/g, " ");

  if (currentChapter.length > 0 && body.length > 0)
    bookArray.push({ title: currentChapter, content: body });

  body = "";
  currentChapter = "";
});

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
  image:
    "https://res.cloudinary.com/dklaggsnl/image/upload/v1669371836/chemin_i3porf.jpg",
  sections: bookArray,
};

console.log(result);
