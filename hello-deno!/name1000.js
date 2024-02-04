const userInput = prompt(`Hi, what would you like to print 1000 times?`);
print1000(userInput)

function print1000 (name) {
  for (let i = 1; i <= 1000; i++) {
      console.log(`${name}, Count:${i}`);
  }
}
