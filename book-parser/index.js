import result1 from "./chemin-parser.js";
import result2 from "./imitation-jesus-parser.js";
import rightFile from "fs";

console.log(result1.title, result2.title);

const bookArray = [result1, result2];

rightFile.writeFileSync(
  "./export/export.js",
  `${bookArray
    .map(
      (book, index) => `const book${index} = {
    title: "${book.title}",
    author: "${book.author}",
    sections: ${JSON.stringify(book.sections)},
  };`
    )
    .join("")}
    
    const books = [${bookArray.map((book, index) => `book${index}`)}];
    
   
    module.exports = { books };`
);
