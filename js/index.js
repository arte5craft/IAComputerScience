const form = document.querySelector('.studyForm');
const table = document.querySelector('.tbody');
let timeValue;
let doc;
var timer;

function createAlarm(start, end) {
  // find the time till the start
  // add the difference to both the start and end time
  var [startHour, startMin] = start.split(' ').map((str) => parseInt(str));
  var [endHour, endMin] = parseInt(end.split(' ')).map((str) => parseInt(str));
  console.log(endHour);
  timeDifference = (((endHour - startHour) * 60) + (endMin + startMin))*60;
  console.log(endHour - startHour);

  var compareTime = new Date();
  compareTime.setSeconds(compareTime.getSeconds()+10);

  timer = setInterval(function() {
    timeBetweenDates(compareTime);
  }, 940);
}

function timeBetweenDates(time) {
  var start = time;
  var now = new Date();
  var difference = start.getTime() - now.getTime();

  if (difference <= 0) {
    clearInterval(timer);
  } else {
    var seconds = Math.floor(difference / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    hours %= 24;
    minutes %= 60;
    seconds %= 60;
    console.log(days+":"+hours+":"+minutes+":"+seconds);
  }
}


form.addEventListener('submit', (e) => {
  submit(e);
  e.preventDefault();
});

const submit = (e) => {
  const formData = new FormData(e.target);
  formData.append('quality', '<div><select id="quality" class="form-select" required aria-label="Disabled select example" disabled><option value="">Quality</option><option value="1">Great!</option><option value="2">Moderate</option><option value="3">Bad</option></select><div class="invalid-feedback">Example invalid select feedback</div></div>');
  // Update the val array to include the alarm object
  const row = document.createElement('tr');
  const data = Object.fromEntries(formData.entries());
  const start = data.stime;
  const end = data.ftime;
  createAlarm(start,end);

  let val = [
    data.subject,
    data.stime + "-" + data.ftime,
    data.priority,
    data.progress,
    data.quality,
  ];

  for (const value of val) {
    const tableData = document.createElement('td');
    tableData.innerHTML = value;
    row.appendChild(tableData);
  }

  table.append(row);
  db.collection("users").doc(uid).collection("schedules").add(data)
    .then(() => {
      console.log('success');
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

// add a code so that when the final time has been reached, the dropdown box will unlock
//
