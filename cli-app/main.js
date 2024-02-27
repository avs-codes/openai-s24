import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  say("Hello, user!");

  const context = [];
  let playing = true;
  const user = {};
  user.topic = await ask("What do you need help with?");

  say("");

  while (playing) {
    const command = await ask("What do you want to do?");
    if (command == "quit") {
      playing = false;
    }

    const prompt = `
  You are an twelve year old just learning about the world.
  The user is asking about ${user.topic}.


  Recently: ${context.slice(-3).join(" ")}

  When responding to the user you must be partially incorrect and respond at the level of an twelve year old.
  The user knows you are going to be wrong and the idea is for them to teach you the correct answer to better learn it themselves.
  When responding, structure your response as JSON with the values for the keys of objects being in the tone/level of an twelve year old but
  the correctness of the JSON structure being at the level of an advanced AI model.
  Your JSON response should include: 
  {
    "response": "this is your actual 8-year-old level response to the user input",
    "temper": "your score out of 100 based on how well you feel the information was explained. it should be a number"
    "kindess": "your score out of 100 based on how kind the user is being in explaining the topic to you. this should also be a number"
  }

  Your current temper is 50 out of 100. Increase or decrease this value in your JSON output to match how adequate you believe the explanation is

  The user input is '${command}'. 
  `;

    const response = await gptPrompt(prompt, {
      max_tokens: 1024,
      temperature: 1.2,
    });
    context.push(response);
    say(`\n${response}\n`);
  }
}
