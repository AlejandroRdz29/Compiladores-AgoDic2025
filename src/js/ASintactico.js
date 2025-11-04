// Analizador Sintactico "Lookahead 1"

// Variables Globales
var tokens = [];
var pos = 0;

// Funciones
function lookahead(pos){
    return tokens[pos];
}

function match(expectedToken){
    if(lookahead().tipo === expectedToken || lookahead().token === expectedToken){
        pos++;
    } else {
        throw new Error(`Error Sintactico: Se esperaba ${expectedToken} pero se encontro ${lookahead(0).tipo}`);
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
    if(['int','bool','void'].includes(lookahead().token)){
        DeclFun();
        DeclFunList();
    } else{
        // ε
        return;
    }
}

// DeclFun -> Decl | FunDef
function DeclFun(){
    if(['int','bool','void'].includes(lookahead().token)){
        // Si en dos posiciones adelante hay un '(', es una definicion de funcion
        if(lookahead(2) === '('){
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
    if(lookahead().token === '='){
        match('=');
        Expr();
        match(';');
    } else if(lookahead().token === ';'){
        match(';');
    } else {
        throw new Error(`Error Sintactico: Se esperaba '=' o ';' pero se encontro ${lookahead().tipo} en la linea ${lookahead().linea}`);
    }
}

// ArrOpt -> '[' NUM ']' | ε
function ArrOpt(){
    if(lookahead().token === '['){
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
    if(['int','bool','void'].includes(lookahead().token)){
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
    if(lookahead().token === ','){
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
    if(['int','bool','void'].includes(lookahead().token)){
        match(lookahead().token);
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
    if(['{','int','bool','void','=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','(', 'if', 'while', 'for', 'return', 'break', 'continue'].includes(lookahead().token || lookahead().tipo)){
        Stmt();
        StmtList();
    } else {
        // ε
        return;
    }
}

// Stmt -> Block | Decl | ExprStmt | IfStmt | WhileStmt | ForStmt | ReturnStmt | BreakStmt | ContinueStmt
function Stmt(){
    if(lookahead().token === '{'){
        Block();
    } else if(['int','bool','void'].includes(lookahead().token)){
        Decl();
    } else if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead().token) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        ExprStmt();
    } else if(lookahead().token === 'if'){
        IfStmt();
    } else if(lookahead().token === 'while'){
        WhileStmt();
    } else if(lookahead().token === 'for'){
        ForStmt();
    } else if(lookahead().token === 'return'){
        ReturnStmt();
    } else if(lookahead().token === 'break'){
        BreakStmt();
    } else if(lookahead().token === 'continue'){
        ContinueStmt();
    }
}

// ExprStmt -> Expr ';' | ';'
function ExprStmt(){
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead().token) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        Expr();
        match(';');
    } else if(lookahead().token === ';'){
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
    if(lookahead().token === 'else'){
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
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead().token) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        Expr();
    } else {
        // ε
        return;
    }
}

// ForCond -> Expr | ε
function ForCond(){
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead().token) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        Expr();
    } else {
        // ε
        return;
    }
}

// ForIter -> Expr | ε
function ForIter(){
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead().token) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
        Expr();
    } else {
        // ε
        return;
    }
}

// ReturnStmt -> 'return' Expr ';' | 'return' ';'
function ReturnStmt(){
    match('return');
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead().token) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
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
    if(lookahead().token === '='){
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
    if(lookahead().token === '||'){
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
    if(lookahead().token === '&&'){
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
    if(lookahead().token === '==' || lookahead().token === '!='){
        match(lookahead().token);
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
    if(['<','<=','>','>='].includes(lookahead().token)){
        match(lookahead().token);
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
    if(lookahead().token === '+' || lookahead().token === '-'){
        match(lookahead().token);
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
    if(lookahead().token === '*' || lookahead().token === '/' || lookahead().token === '%'){
        match(lookahead().token);
        Unary();
        MulTail();
    } else {
        // ε
        return;
    }
}

// Unary -> ('!' | '-') Unary | Postfix
function Unary(){
    if(lookahead().token === '!' || lookahead().token === '-'){
        match(lookahead().token);
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
    if(lookahead().token === '('){
        match('(');
        ArgListOpt();
        match(')');
        PostfixTail();
    } else if(lookahead().token === '['){
        match('[');
        Expr();
        match(']');
        PostfixTail();
    } else if(lookahead().token.token === '.'){
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
    } else if(lookahead().token === 'true'){
        match('true');
    } else if(lookahead().token === 'false'){
        match('false');
    } else if(lookahead() === '('){
        match('(');
        Expr();
        match(')');
    }
}

// ArgListOpt -> ArgList | ε
function ArgListOpt(){
    if(['=','||','&&','==', '!=', '<','<=','>','>=','+','-','*','/','!','ID','NUM','STRING','true','false','('].includes(lookahead().token) || ['NUM','STRING','BOOLEAN'].includes(lookahead().tipo)){
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
    if(lookahead().token === ','){
        match(',');
        Expr();
        ArgListTail();
    } else {
        // ε
        return;
    }
}

// Principal
function analizarSintactico(tokens) {
    try{
        console.log("Iniciando Analisis Sintactico...");
        Program();
        console.log("Analisis Sintactico Completo sin errores.");
    } catch(e){
        console.error(e.message);
    }
}