(() => {

  const owner = "teto-developer";
  const repo = "Suwakkoitiba";
  const branch = "main";

  document.body.style.margin = "0";
  document.body.style.background = "#1e1e1e";
  document.body.style.color = "white";
  document.body.style.fontFamily =
    "ui-monospace, SFMono-Regular, Menlo, monospace";

  // --- UI作成 ---
  const title = document.createElement("div");
  title.textContent = "Repository Viewer";
  title.style.padding = "12px";
  title.style.borderBottom = "1px solid #333";

  const list = document.createElement("div");
  list.style.height = "40vh";
  list.style.overflow = "auto";
  list.style.padding = "10px";

  const viewer = document.createElement("pre");
  viewer.style.height = "60vh";
  viewer.style.overflow = "auto";
  viewer.style.padding = "16px";
  viewer.style.whiteSpace = "pre-wrap";

  document.body.appendChild(title);
  document.body.appendChild(list);
  document.body.appendChild(viewer);

  // --- repo取得 ---
  async function loadRepo(){

    try{
      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
      );

      const tree = await treeRes.json();

      const files = tree.tree.filter(f =>
        f.type === "blob" &&
        f.path.match(/\.(js|html|css|txt|json|md)$/)
      );

      list.innerHTML = "";

      files.forEach(file => {

        const item = document.createElement("div");
        item.textContent = file.path;
        item.style.padding = "6px";
        item.style.cursor = "pointer";
        item.style.borderRadius = "4px";

        item.onclick = async () => {

          viewer.textContent = "Loading...";

          const res = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`
          );

          viewer.textContent =
            `// ${file.path}\n\n` + await res.text();
        };

        item.onmouseover = () => {
          item.style.background = "#333";
        };

        item.onmouseout = () => {
          item.style.background = "transparent";
        };

        list.appendChild(item);
      });

    }catch(e){
      viewer.textContent = "Load error";
    }
  }

  loadRepo();

})();
