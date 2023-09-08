const form = document.querySelector('.studyForm');
const table = document.querySelector('.tbody');
let timeValue;
let doc;
var begin;
var finish;

const activeAlarms = document.querySelector(".activeAlarms");
const alarmSound = new Audio("./alarm.mp3");

let alarmsArray = [];
let alarmIndex = 0;

// Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject, objIndex, exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Display Time
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds())
  ];

  // Alarm
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}

// Create alarm div
const createAlarm = (alarmObj) => {
  // Keys from object
  const { id, alarmHour, alarmMinute } = alarmObj;
  // Alarm div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}</span>`;

  // Checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  // Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  console.log(alarmDiv);

  // Append the alarmDiv to the row
  document.getElementById('container').appendChild(alarmDiv);
};

// Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

// Stop alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
};

// Delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};

form.addEventListener('submit', (e) => {
  submit(e);
  e.preventDefault();
});

const submit = (e) => {
  const formData = new FormData(e.target);
  const ftimeInput = document.getElementById('ftime');
  const selectedTime = ftimeInput.value;

  // Parse the selected time to get hours and minutes
  const [selectedHour, selectedMinute] = selectedTime.split(':');
  console.log(formData.stime);
  // Create an alarm object
  alarmIndex += 1;
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${selectedHour}_${selectedMinute}`;
  alarmObj.alarmHour = selectedHour;
  alarmObj.alarmMinute = selectedMinute;
  alarmObj.isActive = false;

  // Append the alarm object to the formData
  formData.append('progress', alarmObj); // Convert the object to a string
  formData.append('quality', '<div><select id="quality" class="form-select" required aria-label="Disabled select example" disabled><option value="">Quality</option><option value="1">Great!</option><option value="2">Moderate</option><option value="3">Bad</option></select><div class="invalid-feedback">Example invalid select feedback</div></div>');

  // Update the val array to include the alarm object
  const row = document.createElement('tr');
  createAlarm(alarmObj, alarmTd);
  let val = [
    formData.get('subject'),
    formData.get('stime') + '-' + formData.get('ftime'),
    formData.get('priority'), // Convert the object to a string
    formData.get('quality')
  ];

  const data = Object.fromEntries(formData.entries());
  val.forEach((item) => {
    var cell = document.createElement('td');
    cell.innerHTML = item;
    row.appendChild(cell);
  });
  table.appendChild(row);

  db.collection("users").doc(uid).collection("schedules").doc().set(data)
    .then(() => {
      console.log('success');
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}


window.onload = () => {
  setInterval(displayTimer);
  alarmsArray = [];
};
