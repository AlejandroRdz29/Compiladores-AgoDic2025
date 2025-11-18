// Analizador Sintactico "Lookahead 1"

// Variables Globales
var tokens = [];
var pos = 0;

// Funciones
function lookahead(offset = 0){
    var index = pos + offset;
    if (index >= tokens.length) {
        return null;
    }
    return tokens[index];
}

function match(expectedToken){
    var currentToken = lookahead();
    if(currentToken && (currentToken.tipo === expectedToken || currentToken.valor === expectedToken)){
        pos++;
    } else {
        var tokenInfo = currentToken ? `${currentToken.tipo} (${currentToken.valor})` : 'EOF';
        throw new Error(`Error Sintactico: Se esperaba ${expectedToken} pero se encontro ${tokenInfo}`);
    }
}

// Gramatica
// Program -> DeclFunList EOF
function Program(){
    DeclFunList();
    match("EOF");
}

// DeclFunList -> DeclFun DeclFunList | ε
function DeclFunList(){
    var current = lookahead();
    if(current && ['int','bool','void'].includes(current.valor)){
        DeclFun();
        DeclFunList();
    } else{
        // ε
        return;
    }
}

// DeclFun -> Decl | FunDef
function DeclFun(){
    var current = lookahead();
    if(current && ['int','bool','void'].includes(current.valor)){
        // Si en dos posiciones adelante hay un '(', es una definicion de funcion
        var ahead2 = lookahead(2);
        if(ahead2 && ahead2.valor === '('){
            FunDef();
        } else{
            Decl();
        }
    }
}

// Decl -> Type ID ArrOpt DeclTail
function Decl(){
    Type();
    match("ID");
    ArrOpt();
    DeclTail();
}

// DeclTail -> '=' Expr ';' | ';'
function DeclTail(){
    var current = lookahead();
    if(current && current.valor === '='){
        match('=');
        Expr();
        match(';');
    } else if(current && current.valor === ';'){
        match(';');
    } else {
        var tokenInfo = current ? `${current.tipo} (${current.valor})` : 'EOF';
        throw new Error(`Error Sintactico: Se esperaba '=' o ';' pero se encontro ${tokenInfo}`);
    }
}

// ArrOpt -> '[' NUM ']' | ε
function ArrOpt(){
    var current = lookahead();
    if(current && current.valor === '['){
        match('[');
        match('NUM');
        match(']');
    } else {
        // ε
        return;
    }
}

// FunDef -> Type ID '(' ParamListOpt ')' Block
function FunDef(){
    Type();
    match("ID");
    match('(');
    ParamListOpt();
    match(')');
    Block();
}

// ParamListOpt -> ParamList | ε
function ParamListOpt(){
    var current = lookahead();
    if(current && ['int','bool','void'].includes(current.valor)){
        ParamList();
    } else {
        // ε
        return;
    }
}

// ParamList -> Param ParamListTail
function ParamList(){
    Param();
    ParamListTail();
}

// ParamListTail -> ',' Param ParamListTail | ε
function ParamListTail(){
    var current = lookahead();
    if(current && current.valor === ','){
        match(',');
        Param();
        ParamListTail();
    } else {
        // ε
        return;
    }
}

// Param -> Type ID ArrOpt
function Param(){
    Type();
    match("ID");
    ArrOpt();
}

// Type -> 'int' | 'bool' | 'void'
function Type(){
    var current = lookahead();
    if(current && ['int','bool','void'].includes(current.valor)){
        match(current.valor);
    }
}

// Block -> '{' StmtList '}'
function Block(){
    match('{');
    StmtList();
    match('}');
}

// StmtList -> Stmt StmtList | ε
function StmtList(){
    var current = lookahead();
    if(['{','int','bool','void','=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','(', 'if', 'while', 'for', 'return', 'break', 'continue'].includes(current.valor) || ['NUM','STRING','BOOLEAN'].includes(current.tipo)){
        Stmt();
        StmtList();
    } else {
        // ε
        return;
    }
}

// Stmt -> Block | Decl | ExprStmt | IfStmt | WhileStmt | ForStmt | ReturnStmt | BreakStmt | ContinueStmt
function Stmt(){
    var current = lookahead();
    if(current && current.valor === '{'){
        Block();
    } else if(current && ['int','bool','void'].includes(current.valor)){
        Decl();
    } else if(current && (['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','true','false','('].includes(current.valor) || ['NUM','STRING','ID'].includes(current.tipo))){
        ExprStmt();
    } else if(current && current.valor === 'if'){
        IfStmt();
    } else if(current && current.valor === 'while'){
        WhileStmt();
    } else if(current && current.valor === 'for'){
        ForStmt();
    } else if(current && current.valor === 'return'){
        ReturnStmt();
    } else if(current && current.valor === 'break'){
        BreakStmt();
    } else if(current && current.valor === 'continue'){
        ContinueStmt();
    }
}

// ExprStmt -> Expr ';' | ';'
function ExprStmt(){
    var current = lookahead();
    if(current && (['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','true','false','('].includes(current.valor) || ['NUM','STRING','ID'].includes(current.tipo))){
        Expr();
        match(';');
    } else if(current && current.valor === ';'){
        match(';');
    }
}

// IfStmt -> 'if' '(' Expr ')' Stmt ElseOpt
function IfStmt(){
    match('if');
    match('(');
    Expr();
    match(')');
    Stmt();
    ElseOpt();
}

// ElseOpt -> 'else' Stmt | ε
function ElseOpt(){
    var current = lookahead();
    if(current && current.valor === 'else'){
        match('else');
        Stmt();
    } else {
        // ε
        return;
    }
}

// WhileStmt -> 'while' '(' Expr ')' Stmt
function WhileStmt(){
    match('while');
    match('(');
    Expr();
    match(')');
    Stmt();
}

// ForStmt -> 'for' '(' ForInit ';' ForCond ';' ForIter ')' Stmt
function ForStmt(){
    match('for');
    match('(');
    ForInit();
    match(';');
    ForCond();
    match(';');
    ForIter();
    match(')');
    Stmt();
}

// ForInit -> Expr | ε
function ForInit(){
    var current = lookahead();
    if(current && (['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','true','false','('].includes(current.valor) || ['NUM','STRING','ID'].includes(current.tipo))){
        Expr();
    } else {
        // ε
        return;
    }
}

// ForCond -> Expr | ε
function ForCond(){
    var current = lookahead();
    if(current && (['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','true','false','('].includes(current.valor) || ['NUM','STRING','ID'].includes(current.tipo))){
        Expr();
    } else {
        // ε
        return;
    }
}

// ForIter -> Expr | ε
function ForIter(){
    var current = lookahead();
    if(current && (['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','true','false','('].includes(current.valor) || ['NUM','STRING','ID'].includes(current.tipo))){
        Expr();
    } else {
        // ε
        return;
    }
}

// ReturnStmt -> 'return' Expr ';' | 'return' ';'
function ReturnStmt(){
    match('return');
    var current = lookahead();
    if(current && (['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','true','false','('].includes(current.valor) || ['NUM','STRING','ID'].includes(current.tipo))){
        Expr();
    }
    match(';');
}

// BreakStmt -> 'break' ';'
function BreakStmt(){
    match('break');
    match(';');
}

// ContinueStmt -> 'continue' ';'
function ContinueStmt(){
    match('continue');
    match(';');
}

// Expr -> Assign
function Expr(){
    Assign();
}

// Assign -> Or AssignTail
function Assign(){
    Or();
    AssignTail();
}

// AssignTail -> '=' Assign | ε
function AssignTail(){
    var current = lookahead();
    if(current && current.valor === '='){
        match('=');
        Assign();
    } else {
        // ε
        return;
    }
}

// Or -> And OrTail
function Or(){
    And();
    OrTail();
}

// OrTail -> '||' And OrTail | ε
function OrTail(){
    var current = lookahead();
    if(current && current.valor === '||'){
        match('||');
        And();
        OrTail();
    } else {
        // ε
        return;
    }
}

// And -> Eq AndTail
function And(){
    Eq();
    AndTail();
}

// AndTail -> '&&' Eq AndTail | ε
function AndTail(){
    var current = lookahead();
    if(current && current.valor === '&&'){
        match('&&');
        Eq();
        AndTail();
    } else {
        // ε
        return;
    }
}

// Eq -> Rel EqTail
function Eq(){
    Rel();
    EqTail();
}

// EqTail -> ('==' | '!=') Rel EqTail | ε
function EqTail(){
    var current = lookahead();
    if(current && (current.valor === '==' || current.valor === '!=')){
        match(current.valor);
        Rel();
        EqTail();
    } else {
        // ε
        return;
    }
}

// Rel -> Add RelTail
function Rel(){
    Add();
    RelTail();
}

// RelTail -> ('<' | '<=' | '>' | '>=') Add RelTail | ε
function RelTail(){
    var current = lookahead();
    if(current && ['<','<=','>','>='].includes(current.valor)){
        match(current.valor);
        Add();
        RelTail();
    } else {
        // ε
        return;
    }
}

// Add -> Mul AddTail
function Add(){
    Mul();
    AddTail();
}

// AddTail -> ('+' | '-') Mul AddTail | ε
function AddTail(){
    var current = lookahead();
    if(current && (current.valor === '+' || current.valor === '-')){
        match(current.valor);
        Mul();
        AddTail();
    } else {
        // ε
        return;
    }
}

// Mul -> Unary MulTail
function Mul(){
    Unary();
    MulTail();
}

// MulTail -> ('*' | '/' | '%') Unary MulTail | ε
function MulTail(){
    var current = lookahead();
    if(current && (current.valor === '*' || current.valor === '/' || current.valor === '%')){
        match(current.valor);
        Unary();
        MulTail();
    } else {
        // ε
        return;
    }
}

// Unary -> ('!' | '-') Unary | Postfix
function Unary(){
    var current = lookahead();
    if(current && (current.valor === '!' || current.valor === '-')){
        match(current.valor);
        Unary();
    } else {
        Postfix();
    }
}

// Postfix -> Primary PostfixTail
function Postfix(){
    Primary();
    PostfixTail();
}

// PostfixTail -> '(' ArgListOpt ')' PostfixTail | '[' Expr ']' PostfixTail | '.' ID PostfixTail | ε
function PostfixTail(){
    var current = lookahead();
    if(current && current.valor === '('){
        match('(');
        ArgListOpt();
        match(')');
        PostfixTail();
    } else if(current && current.valor === '['){
        match('[');
        Expr();
        match(']');
        PostfixTail();
    } else if(current && current.valor === '.'){
        match('.');
        match('ID');
        PostfixTail();
    } else {
        // ε
        return;
    }
}

// Primary -> 'ID' | 'NUM' | 'STRING' | 'true' | 'false' | '(' Expr ')'
function Primary(){
    var current = lookahead();
    if(current && current.tipo === 'ID'){
        match('ID');
    } else if(current && current.tipo === 'NUM'){
        match('NUM');
    } else if(current && current.tipo === 'STRING'){
        match('STRING');
    } else if(current && current.valor === 'true'){
        match('true');
    } else if(current && current.valor === 'false'){
        match('false');
    } else if(current && current.valor === '('){
        match('(');
        Expr();
        match(')');
    }
}

// ArgListOpt -> ArgList | ε
function ArgListOpt(){
    var current = lookahead();
    if(current && (['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','true','false','('].includes(current.valor) || ['NUM','STRING','ID'].includes(current.tipo))){
        ArgList();
    } else {
        // ε
        return;
    }
}

// ArgList -> Expr ArgListTail
function ArgList(){
    Expr();
    ArgListTail();
}

// ArgListTail -> ',' Expr ArgListTail | ε
function ArgListTail(){
    var current = lookahead();
    if(current && current.valor === ','){
        match(',');
        Expr();
        ArgListTail();
    } else {
        // ε
        return;
    }
}

// Principal
function analizarSintactico(tokensEntrada) {
    // Asignamos los tokens recibidos a la variable global
    tokens = tokensEntrada;
    pos = 0; // Reiniciamos la posición
    
    try{
        console.log("Iniciando Analisis Sintactico...");
        Program();
        alert("Analisis Sintactico Completo sin errores.");
    } catch(e){
        console.error("Error en análisis sintáctico:", e.message);
        alert("Error sintáctico: " + e.message);
    }
}