/* =========================
   Retro Credit Animation
========================= */
document.addEventListener("DOMContentLoaded", ()=>{

  createErrorScreen();

});

function createErrorScreen(){

  const errorScreen = document.createElement("div");
  errorScreen.id = "error-screen";

  const errorText = document.createElement("pre");
  errorText.id = "error-text";

  const closeText = document.createElement("div");
  closeText.id = "close-text";
  closeText.textContent = "Webを閉じてください";

  errorScreen.appendChild(errorText);
  errorScreen.appendChild(closeText);
  document.body.appendChild(errorScreen);

  typeText(`
FATAL ERROR

System crashed.
`, errorText);

  closeText.addEventListener("click", ()=>{
    window.location.href="/game/";
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

  },40);
}
