/*

Code for dividing the studying hours

function distributeStudyTimeWithPriority(subjects, totalHoursPerWeek, subjectPriorities, previousWeekAllocations) {
  const totalPriority = subjectPriorities.reduce((sum, priority) => sum + priority, 0);
  const studyPlan = {};

  subjects.forEach((subject, index) => {
    const priorityPercentage = subjectPriorities[index] / totalPriority;
    const previousAllocation = previousWeekAllocations[subject] || 0;
    const availableHours = totalHoursPerWeek - previousAllocation;

    const allocatedHours = Math.floor(availableHours * priorityPercentage);
    studyPlan[subject] = allocatedHours;
  });

  return studyPlan;
}

const subjects = ["Math", "Science", "History", "English"];
const totalHoursPerWeek = 15; // Total study hours per week

const subjectPriorities = [3, 2, 1, 2]; // Higher values mean higher priority
const previousWeekAllocations = {
  "Math": 5,
  "Science": 3,
  "History": 2,
  "English": 4
};

const studyPlan = distributeStudyTimeWithPriority(subjects, totalHoursPerWeek, subjectPriorities, previousWeekAllocations);
console.log(studyPlan);


************************************

*/
