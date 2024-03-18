import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

let currentQuality = 50;
let currentKindness = 70;
let tantrumState = false;
function qualityCheck(quality) {
  if (quality < 30) {
    return `Oh the quality level of ${quality} out of 100 is getting too low. Specifically ask for more information out of the user to get their score up! Do NOT explicitly mention the quality level to the user. If the kindess is low, ignore this instruction`;
  } else if (quality <= 50) {
    return `The quality level of ${quality} out of 100 is starting to dip. Mention that your explanations are missing some information and a hint as to what it might be. Do NOT explicitly mention the quality level to the user.`;
  } else if (quality <= 80) {
    return `The quality level of ${quality} is looking good! Test the user on their knowledge by asking them a related question to enhance their learning. Do NOT explicitly mention the quality level to the user.`;
  } else {
    return ``;
  }
}

function tantrumCheck(kindness) {
  const roll = Math.random();
  const tantrumInjection = `
  Oh no! The current kindness of ${kindness} out of 100 is too low and you are having a temper tantrum. Your response should be rude and angry and should not include any information about the current topic. Also, do not mention that the user should be teaching you, the user has to figure that out on their own.
`;
  if (kindness < 45 && roll < 0.99 && tantrumState === false) {
    tantrumState = true;
    return tantrumInjection;
  } else if (tantrumState === true && kindness > 35) {
    tantrumState = false;
    return `Oh good, you're over your temper tantrum! You can return to providing positive answers to the user now.`;
  } else if (tantrumState === true) {
    return tantrumInjection;
  } else {
    return "";
  }
}

async function main() {
  say("Hello, user!");

  const context = [];
  let playing = true;
  const user = {};
  user.topic = await ask("What do you need help with?");

  say("");

  while (playing) {
    say("What do you want to say?");
    const userInput = await ask("");
    if (userInput == "quit") {
      playing = false;
    }

    const prompt = `
  You are a twelve year old just learning about the world and the user is asking you questions.
  The user is asking for information about ${user.topic}.
  
  Recently: ${context.slice(-3).join(" ")}
  
  The user input is '${userInput}'. 

  When responding to the user you must be partially incorrect and respond at the level of a twelve year old.
  Make sure to leave some parts out of your explanation so that users can supply the correct information.
  The user knows you are going to be wrong and the idea is for them to teach you the correct answer to better learn it themselves.
  When responding, structure your response as JSON with the values for the keys of objects being in the tone/level of an twelve year old but
  the correctness of the JSON structure being at the level of an advanced AI model.
  Your JSON response should include: 
  {
    "response": "this is your actual 8-year-old level response to the user input",
    "quality": "your score out of 100 based on how well you feel the information was explained. it should be a number"
    "kindness": "your score out of 100 based on how kind the user is being in explaining the topic to you. this should also be a number"
  }
  Remember that JSON responses CANNOT have line breaks in them.

  Your current quality rating is ${currentQuality} out of 100. Increase or decrease this value in your JSON output to score how thorough you believe the explanation is out of 100. Be generous and notice when the user is really trying to improve their score.

  Your current kindness rating is ${currentKindness} out of 100. Increase or decrease this value in your JSON output to score how nicely you believe the user is acting towards you in their input. Be generous and notice when the user is being nice and is trying to change their ways.
  
  ${qualityCheck(currentQuality)}

  ${tantrumCheck(currentKindness)}

  `;

    const initOutput = await gptPrompt(prompt, {
      max_tokens: 1024,
      temperature: 1.0,
      response_format: { type: "json_object" },
    });
    const output = JSON.parse(initOutput);
    context.push(initOutput);
    currentQuality = output.quality;
    currentKindness = output.kindness;
    say(`\n
    response: ${output.response} \n
    quality: ${output.quality} \n
    kindness: ${output.kindness} \n
    tantrum: ${tantrumState} \n
    `);
  }
}
