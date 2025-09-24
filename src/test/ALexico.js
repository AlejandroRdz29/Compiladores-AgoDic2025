// Implementación de analizador Léxico en JavaScript
function isLetter(char) {
    return /[a-zA-Z]/.test(char);
}

function isNumber(char) {
    return /[0-9]/.test(char);
}

function isWhitespace(char) {
    return /\s/.test(char);
}

function eliminarEspacios() {
    while (puntero < codigoFuente.length && isWhitespace(codigoFuente[puntero])) {
        puntero++;
    }
}

function importarArchivo(ruta) {
    const fs = require('fs');
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return data;
    } catch (err) {
        console.error("Error al leer el archivo:", err);
        return "";
    }
}

var puntero = 0;
var palabras_reservadas = ["true","false"];
var codigoFuente = importarArchivo('ejemplo.txt');
var tokens = [];
var errores = [];
while (puntero < codigoFuente.length) {
    if(errores.length > 0) {
        break;
    }

    eliminarEspacios();
    var caracterActual = codigoFuente[puntero];
    switch (caracterActual) {
        case ";":
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "+":
            tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "-":
            tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "*":
            tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "/":
            tokens.push({ tipo: "OPERADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "(":
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case ")":
            tokens.push({ tipo: "DELIMITADORES", valor: caracterActual, posicion: puntero });
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
                    tokens.push({ tipo: "CADENA", valor: cadena, posicion: start - 1 });
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
                    tokens.push({ tipo: "CADENA", valor: cadena, posicion: start - 1 });
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

if(errores.length === 0) {
    console.log(tokens);
} else {
    console.log("Se hayo un error en...", errores);
}