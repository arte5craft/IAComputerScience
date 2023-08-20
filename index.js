const form = document.querySelector('.studyForm');
const table = document.querySelector('.tbody');

form.addEventListener('submit', (e) => {
    submit(e);
    e.preventDefault();
})

function timeCalculation(start, end) {
    var timer = new easytimer.Timer();
    let [hours, mins] = start.split(":");
    let stime = start.split(":");
    let stimemin = parseInt(stime[0]) * 60 + parseInt(stime[1]);
    let ftime = end.split(":");
    let ftimemin = parseInt(ftime[0]) * 60 + parseInt(ftime[1]);
    let diff = ftimemin - stimemin;

    var moment = new Date;
    moment.setHours(hours, mins, 0);

    function pad(num) {
        return (("0" + parseInt(num)).substr(-2));
    }

    function tick() {
        const element = document.getElementById('time');
        const quality = document.getElementById('Quality');
        var now = new Date;
        if (now > start) {
            moment.setDate(moment.getDate() + 1);
        }
        var remain = ((moment - now) / 1000);
        var hh = pad((remain / 60 / 60) % 60);
        var mm = pad((remain / 60) % 60);
        var ss = pad(remain % 60);
        let time = hh + ":" + mm + ":" + ss;
        if (time == '00:00:00') {
            timer.start({ countdown: true, startValues: { minutes: diff } });

            timer.addEventListener('secondsUpdated', function (e) {
                console.log(timer.getTimeValues().toString());
                element.innerHTML = timer.getTimeValues().toString();
            });

            timer.addEventListener('targetAchieved', function (e) {
                element.innerHTML = '00:00:00';
                element.removeAttribute('id');
            });
        }
        setTimeout(tick, 1000);
    }
    tick();
}

/*function timer(start) {
    var myTimer = new Timer();
    document.addEventListener('click', (e) => {
        if (e.target.matches('#startBtn')) {
            timer.start({
                precision: SECONDS,
                startValues: []
            });
        }
        if (e.target.matches('#pauseBtn')) {
            timer.pause()
        }
        if (e.target.matches('#resetBtn')) {
            timer.stop()
        }
    })
}*/
const submit = (e) => {
    const formData = new FormData(e.target);
    const row = document.createElement('tr');
    let progress = '<div id="time"></div>';
    let quality = '<div><select id="priority" class="form-select" required aria-label="Disabled select example" disabled><option value="">Quality</option><option value="1">Great!</option><option value="2">Moderate</option><option value="3">Bad</option></select><div class="invalid-feedback">Example invalid select feedback</div></div>';
    formData.append('progress', progress);
    formData.append('quality', quality);
    const data = Object.fromEntries(formData.entries());
    let val = [data.subject, data.stime + '-' + data.ftime, data.priority, progress, quality];
    val.forEach((item) => {
        var cell = document.createElement('td');
        // var text = document.createTextNode(item);
        cell.innerHTML = item;
        row.appendChild(cell);
        table.appendChild(row);
    })
    timeCalculation(data.stime, data.ftime);

    db.collection("users")
        .doc(uid)
        .collection("schedules")
        .add(data)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    form.reset();
}
