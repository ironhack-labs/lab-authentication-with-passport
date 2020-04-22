const bcrypt = require("bcrypt");

// const salt = bcrypt.genSaltSync();

const salt = "$2b$10$jGxjlfpqnqn/0vhOV9GWWO";
console.log(salt);
const hash = bcrypt.hashSync("hello", salt);

console.log(hash);
