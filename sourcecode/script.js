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
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.height = "100vh";

  const treeView = document.createElement("div");
  treeView.style.width = "280px";
  treeView.style.overflow = "auto";
  treeView.style.borderRight = "1px solid #333";
  treeView.style.padding = "10px";

  const viewer = document.createElement("pre");
  viewer.style.flex = "1";
  viewer.style.padding = "16px";
  viewer.style.overflow = "auto";
  viewer.style.whiteSpace = "pre-wrap";

  container.appendChild(treeView);
  container.appendChild(viewer);
  document.body.appendChild(container);

  // --- アイコン判定 ---
  function getIcon(path){
    if(path.match(/\.(js)$/)) return "📜 ";
    if(path.match(/\.(html)$/)) return "🌐 ";
    if(path.match(/\.(css)$/)) return "🎨 ";
    if(path.match(/\.(json|md|txt)$/)) return "📄 ";
    return "📦 ";
  }

  // --- repo取得 ---
  async function loadRepo(){

    try{

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
      );

      const data = await res.json();

      const files = data.tree.filter(f =>
        f.type === "blob" &&
        f.path.match(/\.(js|html|css|json|md|txt)$/)
      );

      renderTree(files);

    }catch(e){
      treeView.textContent = "Load error";
    }
  }

  // --- ツリー構築 ---
  function renderTree(files){

    treeView.innerHTML = "";

    const tree = {};

    files.forEach(file=>{
      const parts = file.path.split("/");
      let current = tree;

      parts.forEach((part,i)=>{
        if(!current[part]){
          current[part] = {
            __children:{},
            __filePath:null
          };
        }

        if(i === parts.length-1){
          current[part].__filePath = file.path;
        }

        current = current[part].__children;
      });
    });

    function draw(node,parent,depth=0){

      Object.keys(node).forEach(name=>{

        const data = node[name];

        const row = document.createElement("div");
        row.style.paddingLeft = (depth*16)+"px";

        const label = document.createElement("div");
        label.style.cursor = "pointer";
        label.style.padding = "4px";

        const hasChildren =
          Object.keys(data.__children).length > 0;

        label.textContent =
          (hasChildren ? "📁 " : getIcon(name)) + name;

        row.appendChild(label);
        parent.appendChild(row);

        let open=false;
        let childBox;

        label.onclick = async ()=>{

          if(hasChildren){

            if(open){
              childBox.remove();
              open=false;
            }else{
              childBox=document.createElement("div");
              row.appendChild(childBox);

              // アニメ風表示
              childBox.style.opacity="0";
              setTimeout(()=>{
                childBox.style.opacity="1";
                childBox.style.transition="0.2s";
              },10);

              draw(data.__children, childBox, depth+1);
              open=true;
            }

          }else if(data.__filePath){

            viewer.textContent="Loading...";

            const res = await fetch(
              `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${data.__filePath}`
            );

            viewer.textContent =
              `// ${data.__filePath}\n\n` +
              await res.text();
          }

        };

      });

    }

    draw(tree,treeView);
  }

  loadRepo();

})();
