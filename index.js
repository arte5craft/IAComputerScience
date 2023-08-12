addBtn = document.querySelector('.studySessAdd');
form = document.querySelector('.studyForm');
saveBtn = document.querySelector('#submit')
table = document.querySelector('.table');
subjectVal = document.querySelector('#subject');

function test() {
    form.classList.add('active');
}

addBtn.addEventListener('click', test);

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    submit();
})

const submit=() => {
    const row = document.createElement('tr');

    let hours=document.getElementById('hours').value;
    let minutes=document.getElementById('minutes').value;
    let time = hours + ":" + minutes;
    let subject=document.getElementById('subject').value;
    let priority=document.getElementById('priority').value;
    let num1 = 1;
    let num2 = 2;
    let num3 = 3;

    let val = [subject,time, priority, num1,num2, num3];
    val.forEach((item)=>{
        var cell = document.createElement('td');
        var text = document.createTextNode(item);
        cell.appendChild(text);
        row.appendChild(cell);
        table.appendChild(row);
    })
    form.reset();
}
