import { book } from "./books/book-psaumes.js";

const splitVerses = book
  .split("Psaume ")
  .filter((verset) => verset !== ("de David. " || "de David.\n" || "\n"));

let psaumeArray = [];

let psaume = "";
let currentPsaume = "";

for (let verset of splitVerses) {
  const versetNumber = verset.match(/\d*/g)[0];
  if (versetNumber.length > 0 && versetNumber !== currentPsaume) {
    if (psaume.length > 0) {
      psaumeArray.push({ title: currentPsaume, content: psaume });
    }

    currentPsaume = versetNumber;
    psaume = verset.replace(/\d*, \d* /g, "");
  } else if (versetNumber === currentPsaume) {
    psaume = psaume + verset.replace(/\d*, \d* /g, "");
  }
}

console.log(psaumeArray);
