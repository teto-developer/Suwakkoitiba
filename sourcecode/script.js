(() => {

  const owner = "teto-developer";
  const repo = "Suwakkoitiba";
  const branch = "main";

  document.body.style.margin = "0";
  document.body.style.background = "#1e1e1e";
  document.body.style.color = "white";
  document.body.style.fontFamily =
    "ui-monospace, SFMono-Regular, Menlo, monospace";

  // --- UI ---
  const topBar = document.createElement("div");
  topBar.style.padding = "10px";
  topBar.style.borderBottom = "1px solid #333";

  const search = document.createElement("input");
  search.placeholder = "Search files...";
  search.style.width = "100%";
  search.style.padding = "8px";
  search.style.border = "none";
  search.style.background = "#111";
  search.style.color = "white";

  topBar.appendChild(search);

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.height = "100vh";

  const treeView = document.createElement("div");
  treeView.style.width = "260px";
  treeView.style.overflow = "auto";
  treeView.style.borderRight = "1px solid #333";
  treeView.style.padding = "10px";

  const viewer = document.createElement("pre");
  viewer.style.flex = "1";
  viewer.style.padding = "16px";
  viewer.style.overflow = "auto";
  viewer.style.whiteSpace = "pre-wrap";

  document.body.appendChild(topBar);
  container.appendChild(treeView);
  container.appendChild(viewer);
  document.body.appendChild(container);

  // --- Repo取得 ---
  async function loadRepo(){

    try{

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
      );

      const data = await res.json();

      const files = data.tree.filter(f =>
        f.type === "blob" &&
        f.path.match(/\.(js|html|css|txt|json|md)$/)
      );

      renderTree(files);

      // 検索
      search.oninput = () => {
        const q = search.value.toLowerCase();

        renderTree(
          files.filter(f =>
            f.path.toLowerCase().includes(q)
          )
        );
      };

    }catch(e){
      viewer.textContent = "Load error";
    }
  }

  // --- フォルダツリー表示 ---
  function renderTree(files){

    treeView.innerHTML = "";

    const folders = {};

    files.forEach(file=>{
      const parts = file.path.split("/");

      let current = folders;

      parts.forEach((part,i)=>{

        if(!current[part]){
          current[part] = { __files: [] };
        }

        if(i === parts.length-1){
          current[part].__filePath = file.path;
        }

        current = current[part];
      });
    });

    function renderNode(node, parent, depth=0){

      Object.keys(node).forEach(key=>{

        if(key === "__files" || key === "__filePath") return;

        const div = document.createElement("div");
        div.textContent = "📁 " + key;
        div.style.paddingLeft = (depth*14)+"px";
        div.style.cursor = "pointer";
        div.style.padding = "4px";

        const children = node[key];

        let open = false;

        div.onclick = () => {
          open = !open;

          if(open){
            renderNode(children, div, depth+1);
          }else{
            div.nextSibling?.remove();
          }
        };

        parent.appendChild(div);
      });

      if(node.__filePath){
        const file = document.createElement("div");
        file.textContent = "📄 " + node.__filePath.split("/").pop();
        file.style.paddingLeft = (depth*14+14)+"px";
        file.style.cursor = "pointer";
        file.style.padding = "4px";

        file.onclick = async ()=>{
          viewer.textContent = "Loading...";

          const res = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${node.__filePath}`
          );

          viewer.textContent =
            `// ${node.__filePath}\n\n` + await res.text();
        };

        parent.appendChild(file);
      }
    }

    renderNode(folders, treeView);
  }

  loadRepo();

})();
