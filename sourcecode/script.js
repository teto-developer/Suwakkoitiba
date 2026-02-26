(() => {
  const owner = "teto-developer";
  const repo = "Suwakkoitiba";
  const branch = "main";
  document.body.innerHTML = "script loaded";

  document.body.style.margin = "0";
  document.body.style.background = "#1e1e1e";
  document.body.style.color = "#ffffff";
  document.body.style.fontFamily =
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  document.body.style.overflow = "hidden";

  const viewer = document.createElement("pre");
  viewer.style.padding = "16px";
  viewer.style.margin = "0";
  viewer.style.height = "100vh";
  viewer.style.overflowY = "auto";
  viewer.style.whiteSpace = "pre-wrap";
  viewer.textContent = "Loading repository...";

  document.body.appendChild(viewer);

  async function getAllFiles(path = "") {
    const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();

    let files = [];

    for (const item of data) {
      if (item.type === "file") {
        files.push(item);
      } else if (item.type === "dir") {
        const subFiles = await getAllFiles(item.path);
        files = files.concat(subFiles);
      }
    }

    return files;
  }

  async function loadRepo() {
    try {
      const files = await getAllFiles();

      let output = "";

      for (const file of files) {
        const res = await fetch(file.download_url);
        const text = await res.text();
        output += `// ${file.path}\n${text}\n\n`;
      }

      viewer.textContent = output;
    } catch (err) {
      viewer.textContent = "Error:\n" + err;
    }
  }

  loadRepo();
})();
