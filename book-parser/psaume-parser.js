import { book } from "./books/book-psaumes.js";

const splitVerses = book
  .split("Psaume ")
  .filter((verset) => verset !== ("de David. " || "de David.\n" || "/n"));

console.log(splitVerses);

let psaumeArray = [];

let psaume = "";
currentPsaume;

for (let verset of splitVerses) {
  if (!currentPsaume) {
    currentPsaume = verset.charAt(0);
  }
  if (verset.charAt(0) === currentPsaume) {
    psaume = psaume.concat(verset.replace(/\d, \d*/, ""));
  }
  if (verset.charAt(0) !== currentPsaume) {
    psaumeArray.push({ title: currentPsaume, content: psaume });
    psaume = "";
    currentPsaume = "";
  }
}
