const panels = document.querySelectorAll(".panel-wrapper > *");
let index = 0;

setInterval(() => {
  panels.forEach((img, i) => img.classList.toggle("show", i == index));
  index = (index + 1) % panels.length;
}, 2000);
