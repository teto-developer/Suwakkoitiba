(async () => {

  const screen = document.getElementById("retro-screen");
  if(!screen) return;

  const lines = [
    "C:\\> credit.exe",
    "Running credit.exe...",
    "制作: Ryouse1",
    "Special Thanks: Everyone"
  ];

  for(let line of lines){
    await typeAndDelete(line, screen);
    await wait(700);
  }

  showError();

})();

async function typeAndDelete(text, el){

  for(let i=0;i<text.length;i++){
    el.textContent += text[i];
    await wait(40);
  }

  await wait(500);

  while(el.textContent.length > 0){
    el.textContent = el.textContent.slice(0,-1);
    await wait(20);
  }

}

function showError(){

  const screen = document.getElementById("retro-screen");

  screen.textContent = "";

  document.body.classList.add("error-mode");
  
  const errorText = `
FATAL ERROR

System crashed.

Webを閉じてください
`;

  typeText(errorText, screen);

  screen.onclick = ()=>{
    window.location.href="/game/";
  };

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

  },40);
}

function wait(ms){
  return new Promise(r=>setTimeout(r,ms));
}
