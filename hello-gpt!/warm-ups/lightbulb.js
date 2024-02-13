import { gptPrompt } from "../../shared/openai.js"
import { ask, say } from "../../shared/cli.js"

const subject = await ask('What would you like a lightbulb joke about?');

const prompt = `
  Tell me a lightbulb joke about ${subject}. Be funny.
`

const response = await gptPrompt(prompt, {
  max_tokens: 64,
  temperature: 1.2,
});

say(response);
