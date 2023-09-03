const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
const textSlider = document.querySelector(".text-group");

function moveSlider() {
  let index = this.dataset.value;

  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  bullets.forEach((bull) => bull.classList.remove("active"));
  this.classList.add("active");

  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
}

bullets.forEach((bullet) => {
  bullet.addEventListener("click", moveSlider);
});
