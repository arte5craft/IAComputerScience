function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const sessions = [];

for (let i = 0; i < 10; i++) {
  let subjects = ['maths', 'phy', 'comp sci', 'eng']
  const subject = subjects[getRandomInt(0, 3)]
  const startTime = getRandomDate(new Date('2023-10-01'), new Date('2023-10-20'));
  const duration = getRandomInt(0, 100);

  sessions.push({
    subject: subject,
    start_time: startTime,
    duration: duration
  });
}
console.log(sessions);

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

function sumDurationByWeek(sessions) {
  const weekSums = {};
  let subjects = ['maths', 'phy', 'comp sci', 'eng'];

  for (const subject of subjects) {
    weekSums[subject] = {};
  }

  for (const session of sessions) {
    const [year, weekNo] = getWeekNumber(session.start_time);
    const key = `${year}-W${String(weekNo).padStart(2, '0')}`;

    const subject = session.subject;

    if (!weekSums[subject][key]) {
      weekSums[subject][key] = 0;
    }

    weekSums[subject][key] += session.duration;
  }

  return weekSums;
}

const result = sumDurationByWeek(sessions);
console.log(result);


function allocateStudyHours(subjectPriorities, totalHoursThisWeek, hoursLastWeek, averageBreaksLastWeek) {
  const totalSubjects = subjectPriorities.length;

  // Calculate total priority to determine the proportion of hours for each subject
  const totalPriority = subjectPriorities.reduce((acc, priority) => acc + priority, 0);

  // Calculate the proportion of total hours allocated for each subject based on priority
  const proportionFactors = subjectPriorities.map((priority) => priority / totalPriority);

  // Calculate average study hours considering breaks from the previous week
  const averageStudyHours = hoursLastWeek.map((hours, index) => {
    const adjustedHours = hours + averageBreaksLastWeek[index] * 0.5; // Increase hours for fewer breaks
    return adjustedHours / totalSubjects; // Divide by subjects for average
  });

  // Calculate hours for each subject this week based on proportions and adjusted hours
  const allocatedHoursThisWeek = proportionFactors.map((proportion) => {
    const totalHoursForSubject = proportion * totalHoursThisWeek;
    const subjectIndex = proportionFactors.indexOf(proportion);
    const additionalHours = totalHoursForSubject - averageStudyHours[subjectIndex];
    return hoursLastWeek[subjectIndex] + additionalHours;
  });

  // Check if the sum of allocated hours exceeds total hours
  const totalAllocatedHours = allocatedHoursThisWeek.reduce((acc, hours) => acc + hours, 0);

  // Adjust allocated hours if the sum exceeds the total hours
  if (totalAllocatedHours > totalHoursThisWeek) {
    const difference = totalAllocatedHours - totalHoursThisWeek;
    const adjustmentFactor = difference / totalSubjects;
    allocatedHoursThisWeek.forEach((hours, index) => {
      allocatedHoursThisWeek[index] = Math.round(hours - adjustmentFactor);
    });
  }

  // Output the adjusted allocated study hours for each subject this week
  return allocatedHoursThisWeek;
}


// Example usage
const subjectPriorities = [];
const totalHoursThisWeek = 30;
const hoursLastWeek = [];
const averageBreaksLastWeek = [];

const allocatedHoursThisWeek = allocateStudyHours(
  subjectPriorities,
  totalHoursThisWeek,
  hoursLastWeek,
  averageBreaksLastWeek,
);
console.log("Allocated study hours for this week:", allocatedHoursThisWeek);
