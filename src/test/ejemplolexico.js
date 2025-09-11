// Ejemplo de un analizador léxico simple en JavaScript
// Ejemplo de un analizador léxico simple en JavaScript usando de idea lo visto en la clase 10/09/2025
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

// function eliminarComentarios() {
//     if (codigoFuente[puntero] === '/' && codigoFuente[puntero + 1] === '/') {
//         while (puntero < codigoFuente.length && codigoFuente[puntero] !== '\n') {
//             puntero++;
//         }
//     } else if (codigoFuente[puntero] === '/' && codigoFuente[puntero + 1] === '*') {
//         puntero += 2; // Saltar '/*'
//         while (puntero < codigoFuente.length && !(codigoFuente[puntero] === '*' && codigoFuente[puntero + 1] === '/')) {
//             puntero++;
//         }
//         puntero += 2; // Saltar '*/'
//     }
// }


var puntero = 0;
var codigoFuente = "var x = 10;";
// reservadas = ["si", "sino", "mientras", "hacer", "para", "funcion", "retornar", "clase", "constructor", "nuevo", "este", "super", "importar", "desde", "como", "var", "constante", "verdadero", "falso", "nulo", "y", "o", "no"];
// operadores = ["+", "-", "*", "/", "%", "++", "--", "==", "!=", ">", "<", ">=", "<=", "&&", "||", "!", "=", "+=", "-=", "*=", "/="];
// delimitadores = ["(", ")", "{", "}", "[", "]", ";", ",", "."];
// espacios = [" ", "\t", "\n", "\r"];
// comentarios = ["//", "/*", "*/"];
// simbolos = [";", "+", "-", "*", "/", "(", ")"];
var tokens = [];
var errores = [];
while (puntero < codigoFuente.length) {
    // eliminarComentarios();
    eliminarEspacios();
    var caracterActual = codigoFuente[puntero];
    switch (caracterActual) {
        case ";":
            tokens.push({ tipo: ";", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "+":
            tokens.push({ tipo: "+", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "-":
            tokens.push({ tipo: "-", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "*":
            tokens.push({ tipo: "*", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "/":
            tokens.push({ tipo: "/", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "(":
            tokens.push({ tipo: "(", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case ")":
            tokens.push({ tipo: ")", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        case "=":
            tokens.push({ tipo: "=", valor: caracterActual, posicion: puntero });
            puntero++;
            break;
        default:
            start = puntero;
            if (isNumber(caracterActual)) {
                while (isNumber(codigoFuente[puntero])) {
                    puntero++;
                }
                var numero = codigoFuente.substring(start, puntero);
                tokens.push({ tipo: "NUMERO", valor: numero, posicion: start });
            }
            else if (isLetter(caracterActual)) {
                while (isLetter(codigoFuente[puntero]) || isNumber(codigoFuente[puntero])) {
                    puntero++;
                }
                var palabra = codigoFuente.substring(start, puntero);
                tokens.push({ tipo: "IDENTIFICADOR", valor: palabra, posicion: start });
            }
            else {
                errores.push({ tipo: "ERROR", valor: caracterActual, posicion: puntero });
                puntero++;
            }
        }       
}
console.log("Tokens:", tokens);
console.log("Errores:", errores);