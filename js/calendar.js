// Sample input data
const subjects = ["A", "B", "C"];
const priorityScores = { A: 3, B: 2, C: 1 };
const previousWeekHours = { A: 5, B: 3, C: 2 };
const breaksTaken = { A: 2, B: 1, C: 1 };
const totalHours = 15; // Total hours to be divided this week

// Calculate weighted priority scores
const weightedPriorityScores = {};
subjects.forEach((subject) => {
  weightedPriorityScores[subject] = priorityScores[subject] * (previousWeekHours[subject] - breaksTaken[subject] + 1);
});

// Sort subjects by weighted priority scores in descending order
const sortedSubjects = subjects.sort((a, b) => weightedPriorityScores[b] - weightedPriorityScores[a]);

// Allocate hours based on priority scores and previous week data
const allocatedHours = {};
let totalAllocatedHours = 0;

// Allocate hours based on priority scores and previous week data
sortedSubjects.forEach((subject) => {
  const maxHoursToAllocate = previousWeekHours[subject] - breaksTaken[subject] + 1;
  const remainingHours = totalHours - totalAllocatedHours;
  const hoursToAllocate = Math.min(remainingHours, maxHoursToAllocate);
  allocatedHours[subject] = hoursToAllocate;
  totalAllocatedHours += hoursToAllocate;
});

console.log("Allocated Hours:", allocatedHours);
