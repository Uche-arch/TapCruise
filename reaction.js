document.addEventListener("DOMContentLoaded", () => {
  const heartBtn = document.getElementById("heartBtn");
  const laughBtn = document.getElementById("laughBtn");
  const heartCount = document.getElementById("heartCount");
  const laughCount = document.getElementById("laughCount");

  const apiUrl = "https://tapcruise-backend.onrender.com/api/reactions";

  // Load initial counts
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      heartCount.textContent = data.heart || 0;
      laughCount.textContent = data.laugh || 0;

      if (localStorage.getItem("heartClicked")) {
        heartBtn.classList.add("voted");
      }

      if (localStorage.getItem("laughClicked")) {
        laughBtn.classList.add("voted");
      }
    });

  heartBtn.addEventListener("click", () => {
    if (!localStorage.getItem("heartClicked")) {
      vote("heart");
      localStorage.setItem("heartClicked", "true");
      heartBtn.classList.add("voted");
    }
  });

  laughBtn.addEventListener("click", () => {
    if (!localStorage.getItem("laughClicked")) {
      vote("laugh");
      localStorage.setItem("laughClicked", "true");
      laughBtn.classList.add("voted");
    }
  });

  function vote(type) {
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    })
      .then((res) => res.json())
      .then((data) => {
        heartCount.textContent = data.heart;
        laughCount.textContent = data.laugh;
      });
  }
});
