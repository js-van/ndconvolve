var convolve = require("../index.js");

var a = [[0, 1, 0], [0, 0, 0]];
var b = [[0, 0, 0], [1, 0, 0]];

console.log(a);
console.log(b);
console.log(convolve(a,b));