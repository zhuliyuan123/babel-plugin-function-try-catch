const fn = require('../src/index')
let source = `var fn = async function(n){ console.log(1111) }`;
console.log(fn(source))



