/* globals bootstrap, db, uid */

let countdown;
let timerRunning = false;
let timeLeft = 0;
var formDataObject;
let pauseNum = 0;
let points;

const form = document.querySelector(".studyForm");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("submitBtn");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const clearButton = document.getElementById("clear");

const modTime = document.getElementById("timeSpent");
const modPoints = document.getElementById("points");
const modPauses = document.getElementById("numPause");
const modSubject = document.getElementById("subject");
const modPriority = document.getElementById("priority");
const modGoals = document.getElementById("goals");

function displayTimeLeft(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainderSeconds = seconds % 60;
  const display = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainderSeconds
    .toString()
    .padStart(2, "0")}`;
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
    localStorage.setItem("time", timeLeft);
    if (timeLeft < 0) {
      let myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {});
      myModal.show();
      clearInterval(countdown);
      saveData(formDataObject, formDataObject.subject, formDataObject.hours, points);
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

function saveData(data, subjectName, hours, points) {
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


  db.collection("users")
    .doc(uid)
    .collection("subjects")
    .doc()
    .get().then((doc) => {
      if (doc.exists) {
        // Document data is in doc.data()
        const data = doc.data();
        let numHour = parseInt(data.value.hours) + parseInt(hours);
        let numPoints = parseInt(data.value.points) + parseInt(points);
        let numPauses = parseInt(data.value.pauses) + pauseNum;
        let value = { hours: numHour, points: numPoints, pauses: numPauses }
        db.collection("users").doc(uid).collection("subjects").doc(subjectName).set({
          value: value
        });
        // Now you can work with name, email, and age
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });

  db.collection("users")
    .doc(uid)
    .collection("subjects")
    .doc(subjectName)
    .get().then((doc) => {
      if (doc.exists) {
        // Document data is in doc.data()
        const data = doc.data();
        let numHour = parseInt(data.value.hours) + parseInt(hours);
        let numPoints = parseInt(data.value.points) + parseInt(points);
        let numPauses = parseInt(data.value.pauses) + pauseNum;
        let value = { hours: numHour, points: numPoints, pauses: numPauses }
        db.collection("users").doc(uid).collection("subjects").doc(subjectName).set({
          value: value
        });
        // Now you can work with name, email, and age
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
}

startButton.addEventListener("click", () => {
  var hours = document.getElementById("hours").value;
  var minutes = document.getElementById("minutes").value;
  var formData = new FormData(form);
  formDataObject = Object.fromEntries(formData);
  modTime.innerHTML = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":00";
  modPoints.innerHTML = points = (parseInt(hours) * 10 + parseInt(minutes)).toString() + " points";
  modSubject.innerHTML = formData.get("subject");
  modPriority.innerHTML = formData.get("priority");
  modGoals.innerHTML = formData.get("goals");
  startTimer(hours * 3600 + minutes * 60);
  form.reset();
});

pauseButton.addEventListener("click", () => {
  clearInterval(countdown);
  timerRunning = false;
  pauseNum++;
  pauseButton.disabled = true;
  resumeButton.disabled = false;
});

resumeButton.addEventListener("click", () => {
  startTimer(timeLeft);
});

clearButton.addEventListener("click", () => {
  clearInterval(countdown);
  timerRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  resumeButton.disabled = true;
  clearButton.disabled = true;
  displayTimeLeft(0);
});

const durationHours = 2;
const durationMinutes = 30;
const totalMinutes = durationHours * 60 + durationMinutes;
let elapsedMinutes = 0;

function updateProgress() {
    const progress = document.getElementById("prog");
    const progressText = document.getElementById("progress-text");

    elapsedMinutes++;

    const percentage = (elapsedMinutes / totalMinutes) * 100;
    progress.style.transform = `rotate(-${percentage * 3.6}deg)`; // Corrected rotation
    progressText.textContent = `${percentage.toFixed(2)}%`;

    if (elapsedMinutes >= totalMinutes) {
        clearInterval(progressInterval);
    }
}

const progressInterval = setInterval(updateProgress, 10*60); // Update every minute
