const temperature = prompt('What temperature is it (just the number in Fahrenheit)?')

function tempCheck (temp) {
  if ( temp < 60) {
    return 'ooh, chilly outside!'
  } else if (60 <= temp && temp < 80) {
    return 'wow, nice weather!'
  } else {
    return 'wow sure is hot out!'
  }
}

console.log(tempCheck(temperature))