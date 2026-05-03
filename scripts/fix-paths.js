const fs = require("fs");
const path = require("path");

function walk(dir) {
  let files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (file.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

const htmlFiles = walk(path.join(__dirname, "..", "dist"));

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, "utf8");
  const updated = content
    .replace(/\.\.\/dist\//g, "../")
    .replace(/\.\/dist\//g, "./");

  fs.writeFileSync(file, updated, "utf8");
}
