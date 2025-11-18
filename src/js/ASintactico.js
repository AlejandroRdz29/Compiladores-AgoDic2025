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
    if(['int','bool','void'].includes(lookahead)){
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
    if(lookahead === ','){
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
    if(lookahead === '{'){
        Block();
    } else if(['int','bool','void'].includes(current.valor)){
        Decl();
    } else if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(current.valor) || ['NUM','STRING','BOOLEAN'].includes(current.tipo)){
        ExprStmt();
    } else if(current.valor === 'if'){
        IfStmt();
    } else if(current.valor === 'while'){
        WhileStmt();
    } else if(current.valor === 'for'){
        ForStmt();
    } else if(current.valor === 'return'){
        ReturnStmt();
    } else if(current.valor === 'break'){
        BreakStmt();
    } else if(current.valor === 'continue'){
        ContinueStmt();
    }
}

// ExprStmt -> Expr ';' | ';'
function ExprStmt(){
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead()) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        Expr();
        match(';');
    } else if(lookahead() === ';'){
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
    if(lookahead() === 'else'){
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
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead()) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        Expr();
    } else {
        // ε
        return;
    }
}

// ForCond -> Expr | ε
function ForCond(){
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead()) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        Expr();
    } else {
        // ε
        return;
    }
}

// ForIter -> Expr | ε
function ForIter(){
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead()) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        Expr();
    } else {
        // ε
        return;
    }
}

// ReturnStmt -> 'return' Expr ';' | 'return' ';'
function ReturnStmt(){
    match('return');
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead()) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
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
    if(lookahead() === '='){
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
    if(lookahead() === '||'){
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
    if(lookahead() === '&&'){
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
    if(lookahead() === '==' || lookahead() === '!='){
        match(lookahead());
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
    if(['<','<=','>','>='].includes(lookahead())){
        match(lookahead());
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
    if(lookahead() === '+' || lookahead() === '-'){
        match(lookahead());
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
    if(lookahead() === '*' || lookahead() === '/' || lookahead() === '%'){
        match(lookahead());
        Unary();
        MulTail();
    } else {
        // ε
        return;
    }
}

// Unary -> ('!' | '-') Unary | Postfix
function Unary(){
    if(lookahead() === '!' || lookahead() === '-'){
        match(lookahead());
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
    if(lookahead() === '('){
        match('(');
        ArgListOpt();
        match(')');
        PostfixTail();
    } else if(lookahead() === '['){
        match('[');
        Expr();
        match(']');
        PostfixTail();
    } else if(lookahead().token === '.'){
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
    if(lookahead().tipo === 'ID'){
        match('ID');
    } else if(lookahead().tipo === 'NUM'){
        match('NUM');
    } else if(lookahead().tipo === 'STRING'){
        match('STRING');
    } else if(lookahead() === 'true'){
        match('true');
    } else if(lookahead() === 'false'){
        match('false');
    } else if(lookahead() === '('){
        match('(');
        Expr();
        match(')');
    }
}

// ArgListOpt -> ArgList | ε
function ArgListOpt(){
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead()) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
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
    if(lookahead() === ','){
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