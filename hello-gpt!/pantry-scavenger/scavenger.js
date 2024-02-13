import { gptPrompt } from "../../shared/openai.js";

let pantryList = await Deno.readTextFile('./pantry.txt')
pantryList = pantryList.split('\n')

const prompt = `
  You are a health coach and I would like a recipe that I can make with all of the ingredients in my pantry.

  When making a recipe, make it something savory and filling that I can make myself with relative ease. 
  I would also like for the recipe to be healthy as well.
  Note that you do not have to use every ingredient in my pantry, just decide what would go well together.
  Make sure to include how much of each ingredient to use and all of the necessary cook times.
  Don't include any flavor text before or after the recipe, just the recipe itself

  My pantry ingredients are: ${
    pantryList
  }
`

const response = await gptPrompt(prompt, { max_tokens: 1024, temperature: 1.1 })

console.log(response)