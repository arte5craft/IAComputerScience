const nativePicker = document.querySelector(".nativeDatePicker");
const fallbackPicker = document.querySelector(".fallbackDatePicker");

const year = document.querySelector("#year");
const month = document.querySelector("#month");
const day = document.querySelector("#day");

fallbackPicker.style.display = "none";

const test = document.createElement("input");

try {
  test.type = "date";
} catch (e) {
  console.log(e.message);
}

if (test.type === "text") {
  nativePicker.style.display = "none";
  fallbackPicker.style.display = "block";
  fallbackLabel.style.display = "block";
  populateDays(monthSelect.value);
  populateYears();
}

function populateDays(month) {
  while (daySelect.firstChild) {
    daySelect.removeChild(daySelect.firstChild);
  }
  let dayNum;

  if (
    [
      "January",
      "March",
      "May",
      "July",
      "August",
      "October",
      "December",
    ].includes(month)
  ) {
    dayNum = 31;
  } else if (["April", "June", "September", "November"].includes(month)) {
    dayNum = 30;
  } else {
    const year = yearSelect.value;
    const isLeap = new Date(year, 1, 29).getMonth() === 1;
    dayNum = isLeap ? 29 : 28;
  }

  for (let i = 1; i <= dayNum; i++) {
    const option = document.createElement("option");
    option.textContent = i;
    daySelect.appendChild(option);
  }

  if (previousDay) {
    daySelect.value = previousDay;

    if (daySelect.value === "") {
      daySelect.value = previousDay - 1;
    }

    if (daySelect.value === "") {
      daySelect.value = previousDay - 2;
    }

    if (daySelect.value === "") {
      daySelect.value = previousDay - 3;
    }
  }
}

function populateYears() {
  const date = new Date();
  const year = date.getFullYear();

  for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.textContent = year - i;
    yearSelect.appendChild(option);
  }
}

yearSelect.onchange = () => {
  populateDays(monthSelect.value);
};

monthSelect.onchange = () => {
  populateDays(monthSelect.value);
};

let previousDay;

daySelect.onchange = () => {
  previousDay = daySelect.value;
};
