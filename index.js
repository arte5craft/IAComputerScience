const form = document.querySelector('.studyForm');
const table = document.querySelector('.tbody');
let timeValue;
let doc;
var begin;
var finish;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit(e);
})

const submit = (e) => {
    const formData = new FormData(e.target);

    const start = formData.get('ftime');
    let [hourInput, minuteInput] = start.split(":");
    console.log(hourInput);
    const activeAlarms = document.querySelector(".activeAlarms");
    const setAlarm = document.getElementById("set");
    let alarmsArray = [];
    let alarmSound = new Audio("./alarm.mp3");
    let initialHour = 0,
        initialMinute = 0,
        alarmIndex = 0;
    //Append zeroes for single digit
    const appendZero = (value) => (value < 10 ? "0" + value : value);
    //Search for value in object
    const searchObject = (parameter, value) => {
        let alarmObject,
            objIndex,
            exists = false;
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
    //Display Time
    function displayTimer() {
        let date = new Date();
        let [hours, minutes, seconds] = [
            appendZero(date.getHours()),
            appendZero(date.getMinutes()),
            appendZero(date.getSeconds()),
        ];
        //Display time
        //Alarm
        alarmsArray.forEach((alarm, index) => {
            if (alarm.isActive) {
                if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
                    alarmSound.play();
                    alarmSound.loop = true;
                }
            }
        });
    }
    //Create alarm div
    const createAlarm = (alarmObj) => {
        //Keys from object
        const { id, alarmHour, alarmMinute } = alarmObj;
        //Alarm div
        let alarmDiv = document.createElement("div");
        alarmDiv.classList.add("alarm");
        alarmDiv.setAttribute("data-id", id);
        alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}</span>`;
        //checkbox
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
        //Delete button
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = `<button id="deleteSubject" class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>`;
        deleteButton.classList.add("deleteButton");
        deleteButton.addEventListener("click", (e) => deleteAlarm(e));
        alarmDiv.appendChild(deleteButton);
    };
    //Set Alarm
    //Start Alarm
    const startAlarm = (e) => {
        let searchId = e.target.parentElement.getAttribute("data-id");
        let [exists, obj, index] = searchObject("id", searchId);
        if (exists) {
            alarmsArray[index].isActive = true;
        }
    };
    //Stop alarm
    const stopAlarm = (e) => {
        let searchId = e.target.parentElement.getAttribute("data-id");
        let [exists, obj, index] = searchObject("id", searchId);
        if (exists) {
            alarmsArray[index].isActive = false;
            alarmSound.pause();
        }
    };
    //delete alarm
    const deleteAlarm = (e) => {
        let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
        let [exists, obj, index] = searchObject("id", searchId);
        if (exists) {
            e.target.parentElement.parentElement.remove();
            alarmsArray.splice(index, 1);
        }
    };
    window.onload = () => {
        setInterval(displayTimer);
        initialHour = 0;
        initialMinute = 0;
        alarmIndex = 0;
        alarmsArray = [];
        hourInput.value = appendZero(initialHour);
        minuteInput.value = appendZero(initialMinute);
    };

    // Create an alarm object and add it to the alarmsArray
    alarmIndex += 1;
    let alarmObj = {};
    alarmObj.id = `${alarmIndex}_${hourInput}_${minuteInput}`;
    alarmObj.alarmHour = hourInput;
    alarmObj.alarmMinute = minuteInput;
    alarmObj.isActive = false;

    // Append the alarmObj to the val array

    // Create alarm div
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", alarmObj.id);
    alarmDiv.innerHTML = `<span>${alarmObj.alarmHour}:${alarmObj.alarmMinute}</span>`;

    // Create cell for alarm object and append it to the row
    var alarmObjCell = document.createElement('td');
    alarmObjCell.innerHTML = JSON.stringify(alarmObj);

    // Create cell for alarm div and append it to the row
    var alarmDivCell = document.createElement('td');
    alarmDivCell.appendChild(alarmDiv);

    // Create row and append cells
    const row = document.createElement('tr');
    row.appendChild(alarmObjCell);
    row.appendChild(alarmDivCell);

    // Remove the progdiv
    // let progdiv = alarmObj;

    let qualdiv = '<div><select id="quality" class="form-select" required aria-label="Disabled select example" disabled><option value="">Quality</option><option value="1">Great!</option><option value="2">Moderate</option><option value="3">Bad</option></select><div class="invalid-feedback">Example invalid select feedback</div></div>';
    formData.append('quality', qualdiv);
    formData.append('quality', alarmObj);// formData.append('progress', progdiv);
    // Update the val array to include the alarm object

    let val = [
        formData.subject,
        formData.stime + '-' + formData.ftime,
        formData.priority,
        // Remove progdiv from here
        alarmObj, // Include the alarm object here
        qualdiv
    ];

    const data = Object.fromEntries(formData.entries());
    val.forEach((item) => {
        var cell = document.createElement('td');
        if (typeof item === 'object') {
            // If it's an object (alarm object), convert it to a string before adding it to the cell
            cell.innerHTML = JSON.stringify(item);
        } else {
            // Otherwise, add the item as is
            cell.innerHTML = item;
        }
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
