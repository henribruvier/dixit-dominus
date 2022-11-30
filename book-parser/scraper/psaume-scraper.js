const page = new Array(150).fill(0).map((_, i) => i + 1);

const index9 = page.indexOf(9);

page.splice(index9, 1);
page.splice(8, 0, "9A", "9B");
const index113 = page.indexOf(113);
page.splice(index113, 1);
page.splice(113, 0, "113A", "113B");

page.forEach(async (psaume, index) => {
  const html = await fetch(`https://www.aelf.org/bible/Ps/${psaume}`).then(
    (res) => res.text()
  );

  console.log(html);
});
