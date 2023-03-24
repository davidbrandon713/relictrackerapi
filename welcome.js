const drawTree = () => {
  let height = 16
  let buffer = ' '.repeat(2)
  let treeStr = "\n\x1b[32m"
  for (let i = 1; i <= height; i++) {
    let spaces = buffer + " ".repeat(height - i)
    let hashes = buffer + "#".repeat(i * 2 - 1)
    treeStr += spaces + hashes + spaces + "\n"
  }
  for (let i = 1; i <= (height / 3 - 1); i++) {
    let spaces = buffer + " ".repeat(height - 2)
    let lines = buffer + "\x1b[90m|".repeat(3)
    treeStr += spaces + lines + spaces + "\n"
  }
  return treeStr
}

// ANSI color codes
// https://gist.github.com/raghav4/48716264a0f426cf95e4342c21ada8e7

module.exports = {drawTree}