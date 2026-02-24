document.addEventListener("DOMContentLoaded", async ()=>{

  const screen = document.getElementById("retro-screen");

  const lines = [
    "C:\\> credit.exe",
    "Running credit.exe...",
    "制作: Ryouse1",
    "Special Thanks: Everyone"
  ];

  // クレジット表示
  for(let line of lines){
    await typeAndDelete(line, screen);
    await wait(700);
  }

  // クレジット終了後にERROR表示
  showError(screen);

});

async function typeAndDelete(text, el){

  // タイプ
  for(let i=0;i<text.length;i++){
    el.textContent += text[i];
    await wait(40);
  }

  await wait(500);

  // Backspace削除
  while(el.textContent.length > 0){
    el.textContent = el.textContent.slice(0,-1);
    await wait(20);
  }

}

function showError(screen){

  screen.textContent = "";

  const errorText = `
FATAL ERROR

System crashed.

Webを閉じてください
`;

  typeText(errorText, screen);

  document.addEventListener("click", ()=>{
    window.location.href="/game/";
  }, { once:true });

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
