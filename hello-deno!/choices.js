const exam = [
  {
    question: 'Which of these is a famous Modernist architect from Brazil?',
    choices: [
      '\u001b[41m A. Antoni Gaudi\u001b[0m', 
      '\u001b[42m B. Santiago Calatrava\u001b[0m', 
      '\u001b[43m C. Oscar Niemeyer\u001b[0m',
      '\u001b[44m D. Tadao Ando\u001b[0m'
    ],
    answer: 'C'
  },
  {
    question: 'What building did this architect design in New York City while collaborating with Le Corbusier and Wallace Harrison?',
    choices: [
      '\u001b[41mA. United Nations Secretariat Building\u001b[0m', 
      '\u001b[42mB. Santander Bank\u001b[0m', 
      '\u001b[43mC. Seagram Building\u001b[0m',
      '\u001b[44mD. World Trade Center\u001b[0m'
    ],
    answer: 'A'
  },
  {
    question: `What Brazilian city did that architect famously design many buildings for, that later became Brazil's capital?`,
    choices: [
      '\u001b[41mA. Gramado\u001b[0m', 
      '\u001b[42mB. Brasilia\u001b[0m', 
      '\u001b[43mC. Rio de Janeiro\u001b[0m',
      '\u001b[44mD. São Paulo\u001b[0m'
    ],
    answer: 'B'
  }
]

function administerExam (exam) {
  let score = 0;
  for (let i = 0; i < exam.length; i++) {
    const currentExamPart = exam[i];
    console.log(currentExamPart.question)
    currentExamPart.choices.forEach(choice => {
      console.log(choice)
    });
    const userAnswer = prompt('').toUpperCase();
    if (userAnswer === currentExamPart.answer) {
      score++
    }
  }

  console.log(`Your score on the exam is ${score} out of ${exam.length}!`)
}
console.log('')
administerExam(exam);