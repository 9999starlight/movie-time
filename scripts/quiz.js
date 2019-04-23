window.addEventListener('load', intro);

function intro() {
  // hide main quiz container; add listener for quiz start
  document.querySelector('.mainContainer').classList.add('none');
  document.querySelector('#startQuiz').addEventListener('click', quiz);
}

function quiz() {
  // hide intro
  document.querySelector('.introContainer').classList.add('none');
  // global selectors
  const container = document.querySelector('#container');
  const tim = document.querySelector('#countdown');
  let questions = [];
  let currentQuestion = 0;
  let outcome = 0;
  // fetch API data for questions
  fetch('https://opentdb.com/api.php?amount=20&category=11')
    .then(res => res.json())
    .then(data => {
      data.results.forEach(d => {
        questions.push([d.question, d.correct_answer, d.incorrect_answers]);
      });
      createQuestions();
      document.querySelector('.mainContainer').classList.remove('none');
      document.querySelector('.mainContainer').classList.add('flex');
      function createQuestions() {
        // condition to stop function; result; reset counter; empty array for new fetch
        if (currentQuestion >= questions.length) {
          theEnd();
          clearInterval(sInt);
          currentQuestion = 0;
          outcome = 0;
          questions = []
          return false;
        }
        // questions, options, random sort of options, display
        document.querySelector('#questionNumber').innerHTML = `${currentQuestion + 1} / ${questions.length}`;
        const question = questions[currentQuestion][0];
        const allOptions = [];
        allOptions.push(questions[currentQuestion][2][0],
          questions[currentQuestion][2][1],
          questions[currentQuestion][2][2],
          questions[currentQuestion][1]);
        allOptions.sort(() => Math.random() - 0.5);
        // clear container for next game; appending variable
        container.innerHTML = '';
        let questionList = '';
        // display
        allOptions.forEach(op => {
          if (op !== undefined && op == questions[currentQuestion][1]) {
            questionList += `<label><input type = 'radio' name = 'options' id = 't'
            value = '${op}'><div>${op}</div></label>`;
          } else if (op !== undefined) {
            questionList += `<label><input type = 'radio' name = 'options'
            value = '${op}'><div>${op}</div></label>`;
          }
        })
        container.innerHTML += `<div class = 'question borderR'>${question}<div>`;
        container.innerHTML += questionList;
        container.innerHTML += `<button>Next question</button>`;
        document.querySelector('button').
          addEventListener('click', answerCheck);
      }
      const odbrojOd = new Date().getTime() + 601000;
      // setovanje vremena za quiz.
      const sInt = setInterval(function () {
        const sada = new Date().getTime();
        const razlika = odbrojOd - sada; 
        // Račun za minute and sekunde
        let minuti = Math.floor((razlika % (1000 * 60 * 60)) / (1000 * 60));
        let sekunde = Math.floor((razlika % (1000 * 60)) / 1000);
        sekunde < 10 ? sekunde = `0${sekunde}` : sekunde
        minuti < 10 ? minuti = `0${minuti}` : minuti
        if (razlika >= 0) {
            tim.innerHTML = `${minuti} : ${sekunde}`
        }
        else {
            clearInterval(sInt);
            theEnd()
            tim.innerHTML = "Time's up!";
        }
    }, 1000, createQuestions);

      function answerCheck() {
        const options = document.querySelectorAll('input[name="options"]');
        options.forEach(function (op) {
          let att = op.getAttribute('id');
          if (att === 't') {
            op.parentNode.classList.add('correctBorder');
          }
          if (op.checked) {
            if (att === 't') {
              outcome++;
              op.parentNode.classList.add('correct');
            } else {
              op.parentNode.classList.add('incorrect');
            }
          }
        });
        //console.log(outcome);
        // Next question; setTimeout to show if question is correct
        currentQuestion++;
        setTimeout(function () {
          createQuestions();
        }, 2000);
      }

      function theEnd() {
        const percentage = parseFloat((outcome * 100) / questions.length).toFixed(2);
        container.innerHTML = `<div class = 'question borderR'>You won ${outcome}
        of ${questions.length} points or ${percentage}%</div>`;
        document.querySelector('#questionNumber').innerHTML = `Finished!`;
      }
    });
}