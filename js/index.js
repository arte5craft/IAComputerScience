/* globals bootstrap, db, uid */
let countdown;
let timerRunning = false;
let timeLeft = 0;
var formDataObject;
let pauseNum = 0;
let elapsedMinutes = 0;
let progressPosition = 0;

const form = document.querySelector(".studyForm");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("submitBtn");
const pauseButton = document.getElementById("pause");
const resumeButton = document.getElementById("resume");
const clearButton = document.getElementById("clear");

const modTime = document.getElementById("timeSpent");
const modPoints = document.getElementById("Points");
const modPauses = document.getElementById("numPause");
const modSubject = document.getElementById("subject");
const modPriority = document.getElementById("priority");
const modGoals = document.getElementById("goals");

var levels = [
  { pointers: 20, name: "1st level" },
  { pointers: 50, name: "2nd level" },
  { pointers: 100, name: "3rd level" },
  { pointers: 200, name: "4th level" },
  { pointers: 300, name: "5th level" },
  { pointers: 400, name: "6th level" },
  { pointers: 500, name: "7th level" },
  { pointers: 600, name: "8th level" },
  { pointers: 700, name: "9th level" },
];

function calculateLevel(points) {
  for (var i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].pointers) {
      if (points === levels[i].pointers) {
        return "You have reached the " + levels[i].name;
      } else {
        return levels[i].name;
      }
    }
  }
  return "No level"; // If points are less than the lowest level threshold
}


// Function to display the remaining time in the timer
function displayTimeLeft(seconds) {
  // Calculate hours, minutes, and remaining seconds from total seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainderSeconds = seconds % 60;
  // Format the time and display it in the timer display element
  const display = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainderSeconds.toString().padStart(2, "0")}`;
  timerDisplay.textContent = display;
}

// Function to start the timer with given seconds and optional resume flag
function startTimer(seconds, resume = false) {
  // Set start and end time for the timer, and update form data
  const startTime = new Date();
  const endTime = new Date();
  endTime.setSeconds(startTime.getSeconds() + seconds);
  formDataObject.start = startTime;
  formDataObject.end = endTime;

  // Set initial progress bar position when starting or resuming
  if (!resume) {
    const progress = document.getElementById("prog");
    progress.style.transform = `rotate(-${progressPosition}deg)`;
    totalMinutes = seconds; // Set total seconds for the progress bar
    elapsedMinutes = 0; // Reset elapsed time to 0 when starting the timer
  }

  // Function to update the progress bar and text
  function updateProgress() {
    // Calculate elapsed time and update progress bar position and text
    elapsedMinutes++;
    const percentage = (elapsedMinutes / totalMinutes) * 100;
    progressPosition = percentage * 3.6; // Calculate new progress bar position
    const progress = document.getElementById("prog");
    progress.style.transform = `rotate(-${progressPosition}deg)`;
    progressText.textContent = `${percentage.toFixed(2)}%`;

    // Clear interval when elapsed time equals total time
    if (elapsedMinutes >= totalMinutes) {
      clearInterval(progressInterval);
    }
  }

  const progressInterval = setInterval(updateProgress, 1000);
  // Start countdown and update timer display every second
  if (timerRunning) return;
  clearInterval(countdown);
  timeLeft = seconds;
  displayTimeLeft(timeLeft);
  timerRunning = true;
  // Enable resume button availability
  startButton.disabled = true;
  pauseButton.disabled = false;
  resumeButton.disabled = true;
  clearButton.disabled = false;
  countdown = setInterval(() => {
    timeLeft--;
    localStorage.setItem("time", timeLeft);
    // Show modal and update points when countdown reaches 0
    if (timeLeft < 0) {
      // Create a Bootstrap modal instance and display it to the user
      let myModal = new bootstrap.Modal(document.getElementById("sessionSummary"), {});
      myModal.show();
      // Clear the countdown interval to stop updating the timer
      clearInterval(countdown);
      let points = formDataObject.hours * 10 + formDataObject.minutes;
       // Save timer data, subject, hours, and calculated points to the database
      saveData(formDataObject, formDataObject.subject, formDataObject.hours, points);
      modPauses.innerHTML = pauseNum;
      // Reset timer state and button availability after the timer ends
      timerRunning = false;
      startButton.disabled = false;
      pauseButton.disabled = true;
      resumeButton.disabled = true;
    } else {
      // If time is still remaining, update the displayed time every second
      displayTimeLeft(timeLeft);
    }
  }, 1000);
}

// Function to save data to Firestore database
function saveData(data, subjectName, hours, points) {
  // Save the data to the "schedules" collection under the current user's ID
  db.collection("users")
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
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });

  db.collection("users")
    .doc(uid)
    .collection("main-info")
    .doc('creation-date')
    .get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        console.log(data.totalPointsAccumulated);
        console.log(points);
        db.collection("users").doc(uid).collection("main-info").doc('creation-date').set({
          totalPointsAccumulated: parseInt(data.totalPointsAccumulated) + parseInt(points),
          CurrentLevel: calculateLevel(parseInt(data.totalPointsAccumulated) + parseInt(points))
        })
        console.log('success');
      } else {
        console.log("No such document!");
      }
    })

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

// Add an event listener to the "startButton" element when it is clicked
startButton.addEventListener("click", () => {
  // Check if the form is valid
  if (form.checkValidity()) {
    // Retrieve the values of hours and minutes from the respective input fields
    var hours = document.getElementById("hours").value;
    var minutes = document.getElementById("minutes").value;
    // Create a new FormData object from the form elements and convert it into a JavaScript object
    var formData = new FormData(form);
    formDataObject = Object.fromEntries(formData);
    // Update the modTime element with the formatted time (HH:MM:SS)
    modTime.innerHTML = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":00";
    modPoints.innerHTML = (parseInt(hours) * 10 + parseInt(minutes)).toString() + " points";
    // Update modSubject, modPriority, and modGoals elements with corresponding form values
    modSubject.innerHTML = formData.get("subject");
    modPriority.innerHTML = formData.get("priority");
    modGoals.innerHTML = formData.get("goals");
    // Start a timer with the total time in seconds (hours * 3600 + minutes * 60)
    startTimer(hours * 3600 + minutes * 60);
  } else {
    // If the form is not valid, prevent form submission and show validation messages
    event.preventDefault();
    form.reportValidity();
  }
  // Reset the form after processing the input values
  form.reset();
});


// Add an event listener to the "pauseButton" element when it is clicked
pauseButton.addEventListener("click", () => {
  // Clear the countdown interval to pause the timer
  clearInterval(countdown);
  // Set the timerRunning flag to false indicating the timer is paused
  timerRunning = false;
  // Increment the pause count
  pauseNum++;
  // Disable the pause button after it is clicked
  pauseButton.disabled = true;
  // Enable the resume button to allow resuming the timer
  resumeButton.disabled = false;
  // Clear the progress update interval to stop updating progress
  clearInterval(progressInterval);
});

// Add an event listener to the "resumeButton" element when it is clicked
resumeButton.addEventListener("click", () => {
  // Resume the timer with the remaining time and enable progress updates
  startTimer(timeLeft, true);
  progressInterval = setInterval(updateProgress, 1000);
});

// Add an event listener to the "clearButton" element when it is clicked
clearButton.addEventListener("click", () => {
  // Clear the countdown interval and reset the timerRunning flag
  clearInterval(countdown);
  timerRunning = false;

  // Enable the start button, disable pause, resume, and clear buttons
  startButton.disabled = false;
  pauseButton.disabled = true;
});
