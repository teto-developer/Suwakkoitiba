(() => {

const owner="teto-developer";
const repo="Suwakkoitiba";
const branch="main";

/* ================= UI ================= */

document.body.style.margin="0";
document.body.style.background="#0d1117";
document.body.style.color="white";
document.body.style.fontFamily="ui-monospace,monospace";

const top=document.createElement("div");
top.style.padding="10px";
top.style.borderBottom="1px solid #30363d";

const search=document.createElement("input");
search.placeholder="Search files...";
search.style.width="100%";
search.style.padding="10px";
search.style.background="#010409";
search.style.color="white";
search.style.border="1px solid #30363d";

top.appendChild(search);

const container=document.createElement("div");
container.style.display="flex";
container.style.height="100vh";

const treeView=document.createElement("div");
treeView.style.width="320px";
treeView.style.overflow="auto";
treeView.style.borderRight="1px solid #30363d";
treeView.style.padding="10px";

const viewer=document.createElement("pre");
viewer.style.flex="1";
viewer.style.padding="20px";
viewer.style.overflow="auto";
viewer.style.whiteSpace="pre-wrap";
viewer.style.fontSize="14px";

document.body.appendChild(top);
container.appendChild(treeView);
container.appendChild(viewer);
document.body.appendChild(container);

/* ================= Language Map ================= */

const map={
js:"javascript",jsx:"react",ts:"typescript",tsx:"react",
html:"html5",css:"css3",scss:"sass",sass:"sass",
py:"python",java:"java",go:"go",rs:"rust",
c:"c",cpp:"cplusplus",cs:"csharp",
php:"php",rb:"ruby",swift:"swift",
kt:"kotlin",dart:"dart",lua:"lua",
sh:"bash",bash:"bash",
json:"json",xml:"xml",yaml:"yaml",yml:"yaml",
md:"markdown",sql:"mysql"
};

async function getIcon(name){

const ext=name.split(".").pop().toLowerCase();
const lang=map[ext];

if(!lang) return "📄 ";

try{

const url=
`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${lang}/${lang}-original.svg`;

const res=await fetch(url,{cache:"force-cache"});
if(!res.ok) return "📄 ";

return `<img src="${url}" style="width:16px;height:16px;margin-right:6px;vertical-align:middle">`;

}catch{
return "📄 ";
}

}

/* ================= Cache ================= */

const cache=new Map();

/* ================= Repo Load ================= */

async function loadRepo(){

const res=await fetch(
`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
{cache:"no-store"}
);

const data=await res.json();

const files=data.tree.filter(f=>
f.type==="blob" &&
f.path.match(/\.(js|html|css|json|md|txt|py|java|go|php|ts|tsx|jsx)$/)
);

renderTree(files);

search.oninput=()=>{
const q=search.value.toLowerCase();

renderTree(
files.filter(f=>f.path.toLowerCase().includes(q))
);

};

}

/* ================= Tree Builder ================= */

function renderTree(files){

treeView.innerHTML="";

const tree={};

files.forEach(file=>{
let parts=file.path.split("/");
let current=tree;

parts.forEach((part,i)=>{
if(!current[part]){
current[part]={
__children:{},
__file:null,
__info:file
};
}

if(i===parts.length-1){
current[part].__file=file.path;
current[part].__info=file;
}

current=current[part].__children;
});
});

async function draw(node,parent,depth=0){

for(const name in node){

const data=node[name];

const row=document.createElement("div");
row.style.paddingLeft=(depth*18)+"px";

const label=document.createElement("div");
label.style.cursor="pointer";
label.style.padding="4px";

const hasChildren=
Object.keys(data.__children).length>0;

const icon=await getIcon(name);

const info=data.__info;

label.innerHTML=
(hasChildren?"📁 ":"")+icon+name+
(info?.size?` <span style="opacity:.6">(${(info.size/1024).toFixed(1)}KB)</span>`:"");

row.appendChild(label);
parent.appendChild(row);

let open=false;
let childBox;

label.onclick=async()=>{

if(hasChildren){

if(open){
childBox?.remove();
open=false;
}else{

childBox=document.createElement("div");
row.appendChild(childBox);

childBox.style.opacity="0";
setTimeout(()=>childBox.style.opacity="1",20);

draw(data.__children,childBox,depth+1);

open=true;
}

}else if(data.__file){

viewer.textContent="Loading...";

if(cache.has(data.__file)){
viewer.textContent=
`// ${data.__file} (cached)\n\n`+
cache.get(data.__file);
return;
}

const res=await fetch(
`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${data.__file}?t=${Date.now()}`,
{cache:"no-store"}
);

const text=await res.text();

cache.set(data.__file,text);

viewer.textContent=
`// ${data.__file}\n\n`+
text;

}

};

}

}

draw(tree,treeView);

}

loadRepo();

})();
