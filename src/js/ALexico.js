// global variables
var tokens = [];


// ----- Funciones de Archivos -----
function importarArchivo() {
  const input = document.getElementById("fileInput");
  input.click();
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("codigoFuente").value = e.target.result;
      };
      reader.readAsText(file);
    }
  };
}

function guardarArchivo() {
  const contenido = document.getElementById("codigoFuente").value;
  const blob = new Blob([contenido], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "nuevoEjemplo.txt";
  link.click();
}

function limpiar() {
  document.getElementById("codigoFuente").value = "";
  document.querySelector("#tablaTokens tbody").innerHTML = "";
  document.getElementById("errores").innerHTML = "";
}

// Implementación de analizador Léxico en JavaScript
function isLetter(char) { return /[a-zA-Z]/.test(char); }
function isNumber(char) { return /[0-9]/.test(char); }
function isWhitespace(char) { return /\s/.test(char); }

async function analizar() {
  let codigoFuente = document.getElementById("codigoFuente").value;
  let puntero = 0;
  let tokens = [];
  let errores = [];
  let palabras_reservadas = ["true","false"];

  function eliminarEspacios() {
    while (puntero < codigoFuente.length && isWhitespace(codigoFuente[puntero])) {
      puntero++;
    }
  }

  while (puntero < codigoFuente.length) {
    if (errores.length > 0) break;

    eliminarEspacios();
    let caracterActual = codigoFuente[puntero];
    let start;

    switch (caracterActual) {
      case ";": case "+": case "-": case "*": case "/":
      case "(": case ")": case ",": case ".": case "{":
      case "}": case "[": case "]": case "%":
        tokens.push({ tipo: "DELIMITADOR/OPERADOR", valor: caracterActual, posicion: puntero });
        puntero++;
        break;

      case "=":
            if (codigoFuente[puntero + 1] === "=") {
                tokens.push({ tipo: "OPERADORES", valor: "==", posicion: puntero });
                puntero += 2;
            }
            else {
                tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
                puntero++;
            }
            break;

      case ">":
            if (codigoFuente[puntero + 1] === "=") {
                tokens.push({ tipo: "OPERADORES", valor: ">=", posicion: puntero });
                puntero += 2;
            }
            else {
                tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
                puntero++;
            }
            break;

      case "<":
            if (codigoFuente[puntero + 1] === "=") {
                tokens.push({ tipo: "OPERADORES", valor: "<=", posicion: puntero });
                puntero += 2;
            }
            else {
                tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
                puntero++;
            }
            break;

      case "!":
            if (codigoFuente[puntero + 1] === "=") {
                tokens.push({ tipo: "OPERADORES", valor: "!=", posicion: puntero });
                puntero += 2;
            }
            else {
                tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
                puntero++;
            }
            break;
        case "&":
            if (codigoFuente[puntero + 1] === "&") {
                tokens.push({ tipo: "OPERADORES", valor: "&&", posicion: puntero });
                puntero += 2;
            }
            else {
                errores.push({ tipo: "ERROR", valor: caracterActual, posicion: puntero });
                puntero++;
            }
            break;
        case "|":
            if (codigoFuente[puntero + 1] === "|") {
                tokens.push({ tipo: "OPERADORES", valor: "||", posicion: puntero });
                puntero += 2;
            }
            else {
                errores.push({ tipo: "ERROR", valor: caracterActual, posicion: puntero });
                puntero++;
            }
            break;
        case ',':
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case '.':
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case '{':
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case '}':
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case '[':
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case ']':
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case '%':
            tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        default:
            start = puntero;
            if (isNumber(caracterActual)) {
                while (isNumber(codigoFuente[puntero])) {
                    puntero++;
                }
                var numero = codigoFuente.substring(start, puntero);
                tokens.push({ tipo: "NUM", valor: numero, posicion: start });
            }
            else if (isLetter(caracterActual)) {
                while (isLetter(codigoFuente[puntero]) || isNumber(codigoFuente[puntero])) {
                    puntero++;
                }
                var palabra = codigoFuente.substring(start, puntero);
                if (palabras_reservadas.includes(palabra)) {
                    tokens.push({ tipo: "Keyword", valor: palabra, posicion: start });
                }
                else {
                    tokens.push({ tipo: "ID", valor: palabra, posicion: start });
                }
            }
            else if(caracterActual === '"'){
                puntero++;
                start = puntero;
                while(codigoFuente[puntero] !== '"' && puntero < codigoFuente.length){
                    puntero++;
                }
                if(codigoFuente[puntero] === '"'){
                    var cadena = codigoFuente.substring(start, puntero);
                    tokens.push({ tipo: "STRING", valor: cadena, posicion: start - 1 });
                    puntero++;
                }
                else{
                    errores.push({ tipo: "ERROR", valor: "Cadena no cerrada", posicion: start - 1 });
                }
            }
            else if(caracterActual === "'"){
                puntero++;
                start = puntero;
                while(codigoFuente[puntero] !== "'" && puntero < codigoFuente.length){
                    puntero++;
                }
                if(codigoFuente[puntero] === "'"){
                    var cadena = codigoFuente.substring(start, puntero);
                    tokens.push({ tipo: "STRING", valor: cadena, posicion: start - 1 });
                    puntero++;
                }
                else{
                    errores.push({ tipo: "ERROR", valor: "Cadena no cerrada", posicion: start - 1 });
                }
            }
            else {
                errores.push({ tipo: "ERROR", valor: caracterActual, posicion: puntero });
                puntero++;
            }
    }
  }
        tokens.push({ tipo: "EOF", valor: "EOF", posicion: puntero+1 });
        mostrarResultados(tokens, errores);
        return tokens;
}

// ----- Función Sintáctico (por ahora comentada) -----
// async function sintactico(tokens) {
//     try {
//         const mod = await import('./ASintactico.js');
//         if (typeof mod.analizarSintactico === 'function') {
//             mod.analizarSintactico();
//         } else if (typeof mod.pr === 'function') {
//             mod.pr();
//         }
//     } catch (e) {
//         console.error('Error al cargar el módulo sintáctico:', e);
//     }
// }

function mostrarResultados(tokens, errores) {
  const tbody = document.querySelector("#tablaTokens tbody");
  const divErrores = document.getElementById("errores");

  // Limpiamos primero tabla y errores
  tbody.innerHTML = "";
  divErrores.innerHTML = "";

  if (errores.length > 0) {
    // Si hay errores, se muestran únicamente en la sección de errores
    errores.forEach(e => {
      divErrores.innerHTML += `<p style="color:red">[${e.posicion}] ${e.tipo}: ${e.valor}</p>`;
    });
  } else {
    // Si no hay errores, se muestran los tokens en la tabla
    tokens.forEach(t => {
      let row = `<tr><td>${t.tipo}</td><td>${t.valor}</td><td>${t.posicion}</td></tr>`;
      tbody.innerHTML += row;
    });
  }
}


// ----- Botón Sintáctico (por ahora vacío) ----- 
function sintactico() {
    console.log("Análisis sintáctico no implementado aún.");
}