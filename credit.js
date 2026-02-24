document.addEventListener("DOMContentLoaded", async ()=>{

  const screen = document.getElementById("retro-screen");

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

  showError(screen);

});

async function typeAndDelete(text, el){

  // タイプ
  for(let i=0;i<text.length;i++){
    el.textContent += text[i];
    await wait(40);
  }

  await wait(400);

  // Backspace削除
  while(el.textContent.length > 0){
    el.textContent = el.textContent.slice(0,-1);
    await wait(20);
  }

}

function showError(screen){

  screen.textContent += "\nFATAL ERROR\n";
  screen.textContent += "Webを閉じてください\n";

  const clickHandler = ()=>{
    window.location.href="/game/";
  };

  document.addEventListener("click", clickHandler, { once:true });

}

function wait(ms){
  return new Promise(r=>setTimeout(r,ms));
}
