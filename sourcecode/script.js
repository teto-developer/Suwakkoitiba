(() => {
  const owner = "teto-developer";
  const repo = "Suwakkoitiba";
  const branch = "main";

  document.body.style.margin = "0";
  document.body.style.background = "#1e1e1e";
  document.body.style.color = "#ffffff";
  document.body.style.fontFamily =
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

  const viewer = document.createElement("pre");
  viewer.style.padding = "16px";
  viewer.style.margin = "0";
  viewer.style.height = "100vh";
  viewer.style.overflowY = "auto";
  viewer.style.whiteSpace = "pre-wrap";
  viewer.textContent = "Loading repository...";

  document.body.appendChild(viewer);

  async function loadRepo() {
    try {
      // 👇 これがポイント
      const treeURL =
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

      const treeRes = await fetch(treeURL);
      const treeData = await treeRes.json();

      const files = treeData.tree.filter(item => item.type === "blob");

      let output = "";

      for (const file of files) {
        const rawURL =
          `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`;

        const res = await fetch(rawURL);
        const text = await res.text();

        output += `// ${file.path}\n${text}\n\n`;
      }

      viewer.textContent = output;

    } catch (err) {
      viewer.textContent = "ERROR:\n" + err;
    }
  }

  loadRepo();
})();
