#!/usr/bin/env node
const path = require("path");
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
  let data = "";
  stdin.on("data", chunk => {
    data += chunk;
  });
  stdin.on("end", () => {
    resolve(data);
  });
});

function checkForErrors(data) {
  const dom = new JSDOM(data);
  const invalidLinks = dom.window.document.querySelectorAll(
    ".report dt[id$='404']"
  );
  if (!invalidLinks.length) {
    console.log(color.info("👍 is all good!"));
    process.exit(0);
    return; // all is well
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
ready.then(checkForErrors);
