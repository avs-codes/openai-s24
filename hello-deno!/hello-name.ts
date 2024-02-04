const defaultNameValue = "Sorry but I didn't catch that"
const inputName : string = prompt(`Hi, what's your name?`) || defaultNameValue;
printName(inputName)

function capitalize(word : string) : string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function printName (name : string) {
  if (name === defaultNameValue) {
    console.log(name)
  } else {
    const capitalizedName = capitalize(name);
    console.log(`Wow, I like your name ${capitalizedName}!`);
  }
}
