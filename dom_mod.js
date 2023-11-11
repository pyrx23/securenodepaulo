document.addEventListener("DOMContentLoaded", () => {
  console.log("loadeed");
  const issueBtns = document.querySelectorAll(".u-repeater.u-repeater-1 > div");
  for (let i = 0; i < issueBtns.length; i++) {
    issueBtns[i].classList.add("interact-button");
  }
});
