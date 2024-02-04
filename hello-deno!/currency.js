const inputValue = prompt('What USD amount do you want to convert to BRL (Brazilian Real)?')

function USDtoBRL (input) {
  return input * 4.97
}

console.log(`${inputValue} USD is equal to ${USDtoBRL(inputValue)} BRL!`)