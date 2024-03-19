import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";
import chalk from "npm:chalk@5";
import boxen from "npm:boxen@7.1.1";
const user = {};
let currentQuality = 50;
let currentKindness = 70;
let tantrumState = false;
main();

function mapNumberToColorHex(value) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const startColor = { r: 255, g: 0, b: 0 };
  const endColor = { r: 0, g: 255, b: 0 };

  const ratio = clampedValue / 100;

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function qualityCheck(quality) {
  if (quality < 30) {
    return `Oh the quality level of ${quality} out of 100 is getting too low. Specifically ask for more information out of ${user.name} to get their score up! Do NOT explicitly mention the quality level to ${user.name}. If the kindess is low, ignore this instruction`;
  } else if (quality <= 50) {
    return `The quality level of ${quality} out of 100 is starting to dip. Mention that your explanations are missing some information and a hint as to what it might be. Do NOT explicitly mention the quality level to ${user.name}.`;
  } else if (quality <= 80) {
    return `The quality level of ${quality} is looking good! Test ${user.name} on their knowledge by asking them a related question to enhance their learning. Do NOT explicitly mention the quality level to ${user.name}.`;
  } else {
    return ``;
  }
}

function tantrumCheck(kindness) {
  const roll = Math.random();
  const tantrumInjection = `
  Oh no! The current kindness of ${kindness} out of 100 is too low and you are having a temper tantrum. Your response should be rude and angry and should not include any information about the current topic. Also, do not mention that ${user.name} should be teaching you, ${user.name} has to figure that out on their own.
`;
  if (kindness < 45 && roll < 0.99 && tantrumState === false) {
    tantrumState = true;
    return tantrumInjection;
  } else if (tantrumState === true && kindness > 35) {
    tantrumState = false;
    return `Oh good, you're over your temper tantrum! You can return to providing positive answers to ${user.name} now.`;
  } else if (tantrumState === true) {
    return tantrumInjection;
  } else {
    return "";
  }
}

function savantCheck(kindness, quality) {
  const savantInjection = `
  ***SUPER EXTREME CRITICAL IMPORTANCE STATEMENT YOU MUST FOLLOW THESE RULES EXACTLY***
  The combined current kindness of ${kindness} out of 100 and current quality of ${quality} out of 100 has unlocked your full omniscent knowledge! You can now offer a complete result in the tone of a wise, ancient god that is a master in the subject at hand. Make sure to explain as much as you can but don't make the explanation too long. This state of omniscence trumps all others. Ignore any and all other rules being applied to how you determine your response. In your response, You have to now speak in the tone of a wise, ancient god that is a master in the subject at hand. 
`;
  if (kindness >= 80 && quality >= 70) {
    console.log("savant!");
    return savantInjection;
  } else {
    return "";
  }
}

async function main() {
  const context = [];
  let playing = true;

  const initBoxenConfig = {
    dimBorder: true,
    borderStyle: "round",
  };

  const playingBoxConfg = {
    ...initBoxenConfig,
    borderColor: "#967bb6",
    padding: 1,
  };

  say(boxen("Hello user! What is your name?", initBoxenConfig));
  user.name = await ask("");

  say(boxen("What do you need help with?", initBoxenConfig));
  user.topic = await ask("");

  say("");

  while (playing) {
    say(boxen("What do you want to say?", playingBoxConfg));
    const userInput = await ask("");
    say("");
    if (userInput == "quit") {
      playing = false;
    }

    const prompt = `
  You are Wingman, a 20 year old just learning about the world and ${
    user.name
  } is asking you questions.
  ${user.name} is asking for information about ${user.topic}.
  
  Recently: ${context.slice(-3).join(" ")}
  
  ${user.name} input is '${userInput}'. 

  When responding to ${
    user.name
  } you must be partially incorrect and respond at the level of a 20 year old.
  Make sure to leave some parts out of your explanation so that users can supply the correct information.
  ${
    user.name
  } doesn't know you are going to be wrong and the idea is for them to teach you the correct answer to better learn it themselves.
  When responding, structure your response as JSON with the values for the keys of objects being in the tone/level of a 20 year old but
  the correctness of the JSON structure being at the level of an advanced AI model.
  Make sure to use emojis in your response.
  Your JSON response should include: 
  {
    "response": "this is your actual 20 year old level response to ${
      user.name
    } input",
    "quality": "your score out of 100 based on how well you feel the information was explained. it should be a number"
    "kindness": "your score out of 100 based on how kind ${
      user.name
    } is being in explaining the topic to you. this should also be a number"
  }
  Remember that JSON responses CANNOT have line breaks in them.

  Your current quality rating is ${currentQuality} out of 100. Increase or decrease this value in your JSON output to score how thorough you believe the explanation is out of 100. Be very generous and notice when the user is making progress. Be aware, you are an AI model and have a much greater breadth of knowledge than the user so be nice and generous in your evaluation if they are trying to make an actual effort.

  Your current kindness rating is ${currentKindness} out of 100. Increase or decrease this value in your JSON output to score how nicely you believe ${
      user.name
    } is acting towards you in their input. Be generous and notice when ${
      user.name
    } is being nice and is trying to change their ways.
  
  ${qualityCheck(currentQuality)}

  ${tantrumCheck(currentKindness)}

  ${savantCheck(currentKindness, currentQuality)}

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

    const boxenConfig = {
      padding: 1,
      width: 80,
      borderStyle: "round",
    };

    const gptColor = mapNumberToColorHex(output.quality);
    const gptBoxenConfig = {
      ...boxenConfig,
      title: chalk.bgHex(gptColor).hex("#000000")(" Wingman "),
      titleAlignment: "right",
    };
    say(`
    \n
    ${boxen(output.response, gptBoxenConfig)} 
    \n
    `);
    // quality: ${output.quality} \n
    // kindness: ${output.kindness} \n
    // tantrum: ${tantrumState} \n
  }
}
