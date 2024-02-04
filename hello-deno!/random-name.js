const fullName = ['Alex', 'Silva'];

function randomPickFromArr (arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

console.log(`The name you got is ${randomPickFromArr(fullName)}!`)