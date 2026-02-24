/* =========================
   Retro Credit Animation
========================= */
document.addEventListener("DOMContentLoaded", async ()=>{

  const screen = document.getElementById("retro-screen");

  const lines = [
    "C:\\> credit",
    "Running credit.exe...",
    "制作: Ryouse1",
    "Special Thanks: Everyone"
  ];

  for(let line of lines){
    await backspaceType(line, screen);
    await wait(800);
  }

  showError();
});

async function backspaceType(text, el){

  while(el.textContent.length > 0){
    el.textContent = el.textContent.slice(0,-1);
    await wait(15);
  }

  for(let i=0;i<text.length;i++){
    el.textContent += text[i];
    await wait(40);
  }
}

function showError(){

  const errorScreen = document.getElementById("error-screen");
  const errorText = document.getElementById("error-text");
  const closeText = document.getElementById("close-text");

  errorScreen.style.display = "block";

  typeText(`
FATAL ERROR

System crashed.

Click below to continue.
`, errorText);

  closeText.addEventListener("click", ()=>{
    window.location.href = "/Suwakkoitiba/game/";
  });
}

function typeText(text, el){
  let i=0;
  el.textContent="";

  const interval=setInterval(()=>{
    el.textContent += text[i];
    i++;

    if(i>=text.length){
      clearInterval(interval);
    }

  },30);
}

function wait(ms){
  return new Promise(r=>setTimeout(r,ms));
}
