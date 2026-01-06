const fs = require("fs");

const languages = {
  js: { ext: "js", main: "index.js" },
  py: { ext: "py", main: "main.py" }
};

const projectTypes = {
  server: ["network","router","request","response","session","handler"],
  game: ["engine","world","entity","input","render","physics"],
  compiler: ["lexer","parser","ast","optimizer","emitter"]
};

function pick(o){ return Object.keys(o)[Math.floor(Math.random()*Object.keys(o).length)]; }
function rand(n){ return Math.floor(Math.random()*n); }

const lang = pick(languages);
const type = pick(projectTypes);
const id = Date.now();
const root = `project_${lang}_${type}_${id}`;
fs.mkdirSync(`${root}/src`, { recursive: true });
fs.mkdirSync(`${root}/lib`, { recursive: true });
const L = languages[lang];
const modules = projectTypes[type];

// Generate modules with interconnected logic
modules.forEach(m => {
  const file = `${root}/src/${m}.${L.ext}`;
  let code = "";
  if(lang === "js"){
    code += `// Module ${m}\n`;
    code += `function ${m}_init(){ console.log("Initializing ${m}"); }\n`;
    for(let i=0;i<500;i++){
      // functions call each other randomly to simulate software behavior
      const target = modules[rand(modules.length)];
      code += `function ${m}_func_${i}(x){ let y = x + ${rand(1000)}; y += ${target}_helper(${rand(50)}); return y; }\n`;
    }
    // Add helper functions
    modules.forEach(mod=>{
      code += `function ${mod}_helper(x){ return x*${rand(20)+1}; }\n`;
    });
    code += `module.exports = { ${modules.map(mod=>mod+"_init").join(", ")} };\n`;
  } else if(lang === "py"){
    code += `# Module ${m}\n`;
    code += `def ${m}_init():\n    print("Initializing ${m}")\n\n`;
    for(let i=0;i<500;i++){
      const target = modules[rand(modules.length)];
      code += `def ${m}_func_${i}(x):\n    y = x + ${rand(1000)}\n    y += ${target}_helper(${rand(50)})\n    return y\n\n`;
    }
    // helper functions
    modules.forEach(mod=>{
      code += `def ${mod}_helper(x):\n    return x*${rand(20)+1}\n\n`;
    });
  }
  fs.writeFileSync(file, code);
});

// Create main file
let entry = "";
if(lang === "js"){
  modules.forEach(m => entry += `const ${m} = require("./${m}.js");\n`);
  entry += `console.log("Project ${type} running");\n`;
  modules.forEach(m => entry += `${m}.${m}_init();\n`);
  entry += `let data = [1,2,3,4,5];\n`;
  for(let i=0;i<100;i++){
    modules.forEach(m=>{
      entry += `data = data.map(x=>${m}_func_${rand(500)}(x));\n`;
    });
  }
  entry += `console.log("Final data:", data);\n`;
} else if(lang === "py"){
  modules.forEach(m => entry += `import ${m}\n`);
  entry += `print("Project ${type} running")\n`;
  modules.forEach(m => entry += `${m}.${m}_init()\n`);
  entry += `data=[1,2,3,4,5]\n`;
  for(let i=0;i<100;i++){
    modules.forEach(m=>{
      entry += `data=[${m}.${m}_func_${rand(500)}(x) for x in data]\n`;
    });
  }
  entry += `print("Final data:", data)\n`;
}
fs.writeFileSync(`${root}/src/${L.main}`, entry);

// Meta & README
fs.writeFileSync(`${root}/meta.json`, JSON.stringify({lang,type,id,modules}, null, 2));
fs.writeFileSync(`${root}/README.md`,
  `# Hardcore Auto Generated Project\n\nLanguage: ${lang}\nType: ${type}\nModules: ${modules.join(", ")}\nID: ${id}\n`
);
