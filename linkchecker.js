#!/usr/bin/env node
const { JSDOM } = require("jsdom");
const colors = require("colors");
colors.setTheme({
  error: "red",
  info: "green",
  details: "blue",
});

console.log(colors.info("☕ Link checker can take about 1-2 mins... \n"));

const ready = new Promise(resolve => {
  const stdin = process.openStdin();
  let html = "";
  stdin.on("data", chunk => {
    html += chunk;
  });
  stdin.on("end", () => {
    resolve(html);
  });
});

function checkForErrors(html) {
  const dom = new JSDOM(html);
  const invalidLinks = dom.window.document.querySelectorAll(
    ".report dt[id$='404']"
  );
  if (!invalidLinks.length) {
    console.log(colors.info("👍 is all good!"));
    return process.exit(0);
  }
  Array.from(invalidLinks).map(elem =>
    console.error(
      colors.error("💀 " + elem.textContent + "\n"),
      colors.info(elem.nextElementSibling.textContent + "\n"),
      colors.details(
        elem.nextElementSibling.nextElementSibling.textContent + "\n"
      ),
      "\n"
    )
  );
  process.exit(1);
}
ready
  .then(checkForErrors)
  .catch(err => console.log(colors.error(err.message), err.stack));
