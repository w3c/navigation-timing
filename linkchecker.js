const path = require("path");
const { JSDOM } = require("jsdom");
const fsp = require("fs-promise");
const colors = require("colors");
colors.setTheme({
  error: "red",
  info: "green",
});

async function checkForErrors() {
  const data = await fsp.readFile(path.join(__dirname, "linkreport.html"), {
    encoding: "UTF-8",
  });
  const dom = new JSDOM(data);
  const invalidLinks = dom.window.document.querySelectorAll(
    ".report dt[id$='404']"
  );
  if (!invalidLinks.length) {
    return; // all is well
  }
  Array.from(invalidLinks).map(elem =>
    console.error(
      colors.error("💀 " + elem.textContent + "\n"),
      colors.info(elem.nextElementSibling.textContent + "\n"),
      colors.info(
        elem.nextElementSibling.nextElementSibling.textContent + "\n"
      ),
      "======\n"
    )
  );
  process.exit(1);
}

checkForErrors();
