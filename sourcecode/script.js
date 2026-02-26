(() => {
  document.body.style.margin = "0";
  document.body.style.width = "100vw";
  document.body.style.height = "100vh";
  document.body.style.background = "#1e1e1e";
  document.body.style.overflow = "hidden";
  document.body.style.fontFamily =
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

  const viewer = document.createElement("pre");

  viewer.style.margin = "0";
  viewer.style.padding = "16px";
  viewer.style.width = "100%";
  viewer.style.height = "100%";
  viewer.style.color = "#ffffff";
  viewer.style.whiteSpace = "pre-wrap";
  viewer.style.wordBreak = "break-word";
  viewer.style.lineHeight = "1.5";
  viewer.style.boxSizing = "border-box";
  viewer.style.fontSize = "13px";
  viewer.style.overflowY = "auto";

  viewer.textContent = "Loading...";

  document.body.appendChild(viewer);

  // 表示したいファイル一覧
  const files = [
    "index.html",
    "style.css",
    "sourcecode.js"
  ];

  const base =
    "https://raw.githubusercontent.com/teto-developer/Suwakkoitiba/main/";

  Promise.all(
    files.map(file =>
      fetch(base + file)
        .then(res => {
          if (!res.ok) throw new Error(file + " not found");
          return res.text();
        })
        .then(text => `// ${file}\n${text}\n\n`)
    )
  )
    .then(contents => {
      viewer.textContent = contents.join("");
    })
    .catch(err => {
      viewer.textContent = "Error:\n" + err;
    });
})();
