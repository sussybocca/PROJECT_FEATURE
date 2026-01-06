const fs = require("fs");

const languages = {
  js:{ext:"js",main:"index.js"},
  py:{ext:"py",main:"main.py"},
  go:{ext:"go",main:"main.go"},
  c:{ext:"c",main:"main.c"},
  cpp:{ext:"cpp",main:"main.cpp"},
  java:{ext:"java",main:"Main.java"},
  rust:{ext:"rs",main:"main.rs"},
  php:{ext:"php",main:"index.php"},
  lua:{ext:"lua",main:"main.lua"},
  rb:{ext:"rb",main:"main.rb"},
  sh:{ext:"sh",main:"main.sh"}
};

const projectTypes = {
  server:["network","router","request","response","session","handler"],
  game:["engine","world","entity","input","render","physics"],
  compiler:["lexer","parser","ast","optimizer","emitter"],
  encryption:["cipher","hash","keygen","entropy","secure"],
  database:["storage","index","query","engine","transaction"],
  toolkit:["cli","utils","core","plugins"],
  vm:["bytecode","stack","heap","scheduler","runtime"],
  network:["socket","protocol","packet","transport","router"],
  filesystem:["inode","block","cache","journal","mount"]
};

function pick(o){ return Object.keys(o)[Math.floor(Math.random()*Object.keys(o).length)]; }
function rand(n){ return Math.floor(Math.random()*n); }

const lang = pick(languages);
const type = pick(projectTypes);
const id = Date.now();

const root = `project_${lang}_${type}_${id}`;
fs.mkdirSync(`${root}/src`,{recursive:true});
fs.mkdirSync(`${root}/lib`,{recursive:true});

const L = languages[lang];
const modules = projectTypes[type];

let entry = "";
for(let i=0;i<modules.length;i++){
  const m = modules[i];
  const file = `${root}/src/${m}.${L.ext}`;

  let code = "";
  for(let j=0;j<800;j++){
    code += `${m}_function_${j} = ${rand(999999)}\n`;
  }
  fs.writeFileSync(file, code);
  entry += `import "./${m}.${L.ext}"\n`;
}

let main = "";
for(let i=0;i<1500;i++){
  main += `main_process_${i} = ${rand(999999)}\n`;
}

fs.writeFileSync(`${root}/src/${L.main}`, entry + "\n" + main);

fs.writeFileSync(`${root}/meta.json`, JSON.stringify({lang,type,id,modules},null,2));

fs.writeFileSync(`${root}/README.md`,
  `# Auto Generated Project\n\nLanguage: ${lang}\nType: ${type}\nModules: ${modules.join(", ")}\nID: ${id}\n`
);
