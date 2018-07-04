{
  console.log("hoge");
  const out = document.getElementById("out");
  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", (ev) => {
    console.log("click!");
    console.log(window.history.state);
    const rand = Math.floor(Math.random() * 10);
    console.log(rand);
    out.innerText = rand < 5 ? "hoge" : "fuga";
  });
}