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

  // --- IndexedDB ---
  function openDB(){
    return new Promise((resolve,reject)=>{
      const req = indexedDB.open("repoCache",1);

      req.onupgradeneeded = e=>{
        const db = e.target.result;
        if(!db.objectStoreNames.contains("files")){
          db.createObjectStore("files",{keyPath:"path"});
        }
      };

      req.onsuccess = e=> resolve(e.target.result);
      req.onerror = reject;
    });
  }

  async function getCache(db,path){
    return new Promise(res=>{
      const tx = db.transaction("files","readonly");
      const store = tx.objectStore("files");
      const req = store.get(path);

      req.onsuccess = ()=> res(req.result);
      req.onerror = ()=> res(null);
    });
  }

  async function setCache(db,file){
    const tx = db.transaction("files","readwrite");
    tx.objectStore("files").put(file);
  }

  // --- ファイルアイコン ---
  function getIcon(path){
    if(path.endsWith(".js")) return "📜 ";
    if(path.endsWith(".html")) return "🌐 ";
    if(path.endsWith(".css")) return "🎨 ";
    return "📄 ";
  }

  async function loadRepo(){

    try{

      const db = await openDB();

      const treeRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
      );

      const treeData = await treeRes.json();

      const files = treeData.tree.filter(f =>
        f.type === "blob" &&
        f.path.match(/\.(js|html|css|json|md|txt)$/)
      );

      renderTree(files,db);

    }catch(e){
      treeView.textContent = "Load error";
    }
  }

  function renderTree(files,db){

    treeView.innerHTML="";

    const tree={};

    files.forEach(file=>{
      const parts=file.path.split("/");
      let current=tree;

      parts.forEach((part,i)=>{
        if(!current[part]){
          current[part]={
            __children:{},
            __filePath:null
          };
        }

        if(i===parts.length-1){
          current[part].__filePath=file.path;
        }

        current=current[part].__children;
      });
    });

    async function draw(node,parent,depth=0){

      for(const name in node){

        const data=node[name];

        const row=document.createElement("div");
        row.style.paddingLeft=(depth*16)+"px";

        const label=document.createElement("div");
        label.style.cursor="pointer";
        label.style.padding="4px";

        const hasChildren=
          Object.keys(data.__children).length>0;

        label.textContent=
          (hasChildren?"📁 ":"📄 ")+name;

        row.appendChild(label);
        parent.appendChild(row);

        let open=false;
        let childBox;

        label.onclick=async()=>{

          if(hasChildren){

            if(open){
              childBox.remove();
              open=false;
            }else{
              childBox=document.createElement("div");
              row.appendChild(childBox);

              draw(data.__children,childBox,depth+1);
              open=true;
            }

          }else if(data.__filePath){

            viewer.textContent="Loading...";

            const cache = await getCache(db,data.__filePath);

            if(cache){
              viewer.textContent=
                `// ${data.__filePath} (cached)\n\n`+
                cache.content;
              return;
            }

            const res=await fetch(
              `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${data.__filePath}?t=${Date.now()}`
            );

            const text=await res.text();

            viewer.textContent=
              `// ${data.__filePath}\n\n`+
              text;

            await setCache(db,{
              path:data.__filePath,
              content:text
            });
          }

        };
      }
    }

    draw(tree,treeView);
  }

  loadRepo();

})();
