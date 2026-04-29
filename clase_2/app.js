// console.log(process.argv[2]);
// console.log(process.argv[3]);
const comando = process.argv.slice(2);
// console.log(comando);
if (comando == "start") {
  console.log("Inciando servidor....");
} else if (comando == "backup") {
  console.log("generando backup de la DB");
} else if (comando == "salir") {
  console.log("Saliendo del sistema...");
} else {
  console.log("Lo siento amigo esto eno es vaslido");
}


process.on("evento", ()=>{

})

// FIles2Prompt

// ratelimit