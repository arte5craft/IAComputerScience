const form = document.querySelector('.studyForm');
const table = document.querySelector('.tbody');
let startBtn = document.querySelector('#startBtn');
let pauseBtn = document.querySelector('#pauseBtn');
let resetBtn = document.querySelector('#resetBtn');

let hours = document.querySelector('#hours');
let minutes = document.querySelector('#minutes');
let seconds = document.querySelector('#seconds');
let secTenth = document.querySelector('#secTenth');

form.addEventListener('submit', (e) => {
    submit();
    e.preventDefault();
})

var timer = new easytimer.Timer();

timer.addEventListener('secondTenthsUpdated', () => {
    const obj = timer.getTimeValues();
    hours.innerText = obj.hours.toString().padStart(2, '0');
    minutes.innerText = obj.minutes.toString().padStart(2, '0');
    seconds.innerText = obj.seconds.toString().padStart(2, '0');
    secTenth.innerText = obj.secondTenths.toString().padStart(2, '0');
})

startBtn.addEventListener('click', () => {
    timer.start({
        precision: 'secondTenths'
    })
})

pauseBtn.addEventListener('click', () => {
    timer.pause()
})

resetBtn.addEventListener('click', () => {
    timer.stop()
})

const submit = () => {
    let subjects = document.querySelector('#subjects-form');
    let priorities = document.querySelector('#priority');
    let stime = document.querySelector('#stime').value;
    let ftime = document.querySelector('#ftime').value;
    let subject = subjects.options[subjects.selectedIndex].text;
    let priority = priorities.options[priorities.selectedIndex].text;
    const row = document.createElement('tr');
    let progress=' <div class="timerInfo row"><h3 class="col" id="hours">00</h3><h3 class="col" id="minutes">00</h3><h3 class="col" id="seconds">00</h3><h3 class="col" id="secTenth">00</h3></div><div class="buttons"><button class="btn" id="startBtn">Start</button><button class="btn" id="pauseBtn">Pause</button><button class="btn" id="resetBtn">Reset</button></div>';
    let quality = '<div><select id="priority" class="form-select" required aria-label="Disabled select example" disabled><option value="">Quality</option><option value="1">Great!</option><option value="2">Moderate</option><option value="3">Bad</option></select><div class="invalid-feedback">Example invalid select feedback</div></div>';
    let val = [subject, stime + '-' + ftime, priority, progress, quality];
    val.forEach((item) => {
        var cell = document.createElement('td');
        // var text = document.createTextNode(item);
        cell.innerHTML = item;
        row.appendChild(cell);
        table.appendChild(row);
    })
    form.reset();
}
