let countdown;
let timerRunning = false;
let timeLeft = 0;
var formDataObject;
let pauseNum = 0;
let startTime;
let endTime;

const form = document.querySelector('.studyForm');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('submitBtn');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const clearButton = document.getElementById('clear');

const modTime = document.getElementById('timeSpent');
const modPoints = document.getElementById('points');
const modPauses = document.getElementById('numPause');
const modSubject = document.getElementById('subject');
const modPriority = document.getElementById('priority');
const modGoals = document.getElementById('goals');

function displayTimeLeft(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainderSeconds = seconds % 60;
  const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainderSeconds.toString().padStart(2, '0')}`;
  timerDisplay.textContent = display;
}

function startTimer(seconds) {
  const startTime = new Date();
  const endTime = new Date();
  endTime.setSeconds(startTime.getSeconds() + seconds);
  formDataObject.start = startTime;
  formDataObject.end = endTime;

  if (timerRunning) return;
  clearInterval(countdown);
  timeLeft = seconds;
  displayTimeLeft(timeLeft);
  timerRunning = true;
  startButton.disabled = true;
  pauseButton.disabled = false;
  resumeButton.disabled = true;
  clearButton.disabled = false;
  countdown = setInterval(() => {
    timeLeft--;
    localStorage.setItem('time', timeLeft);
    if (timeLeft < 0) {
      let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
      myModal.show();
      clearInterval(countdown);
      saveData(formDataObject);
      modPauses.innerHTML = pauseNum;
      timerRunning = false;
      startButton.disabled = false;
      pauseButton.disabled = true;
      resumeButton.disabled = true;
    } else {
      displayTimeLeft(timeLeft);
    }
  }, 1000);
}

function saveData(data) {
  db.collection("users")
  .doc(uid)
  .collection("schedules")
  .doc()
  .set(data)
  .then(() => {
    console.log("success");
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
}

startButton.addEventListener('click', () => {
  var hours = document.getElementById('hours').value;
  var minutes = document.getElementById('minutes').value;
  var formData = new FormData(form);
  formDataObject = Object.fromEntries(formData);
  modTime.innerHTML = (hours).toString().padStart(2, '0') + ':' + (minutes).toString().padStart(2, '0') + ":00";
  modPoints.innerHTML = (hours*10 + minutes) + ' points';
  modSubject.innerHTML = formData.get('subject');
  modPriority.innerHTML = formData.get('priority');
  modGoals.innerHTML = formData.get('goals');
  startTimer(hours*3600 + minutes*60);
  form.reset();
});

pauseButton.addEventListener('click', () => {
  clearInterval(countdown);
  timerRunning = false;
  pauseNum++;
  pauseButton.disabled = true;
  resumeButton.disabled = false;
});

resumeButton.addEventListener('click', () => {
  startTimer(timeLeft);
});

clearButton.addEventListener('click', () => {
  clearInterval(countdown);
  timerRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  resumeButton.disabled = true;
  clearButton.disabled = true;
  displayTimeLeft(0);
});

function points() {
  // create a doc to store points for each subject if it does not exist
}
