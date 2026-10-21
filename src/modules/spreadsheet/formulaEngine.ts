/**
 * Safe, robust Formula Engine for Excel Akademi AI
 * Does NOT use eval or Function()!
 * Features:
 * - Full tokenizer and recursive-descent parser
 * - Turkish and English function names (TOPLA/SUM, ORTALAMA/AVERAGE, MAK/MAX, MİN/MIN, SAY/COUNT, BAĞ_DEĞ_DOLU_SAY/COUNTA, EĞER/IF)
 * - Binary & unary arithmetic (+, -, *, /, ^)
 * - Comparison operators (=, <>, !=, <, <=, >, >=)
 * - String literals ("text") and numbers
 * - Ranges (B2:B6, $B$2:$B$6) and cell references ($A$1, A1)
 * - Semicolon (;) and comma (,) argument delimiters
 * - Cycle / Circular reference detection (#DÖNGÜ!)
 * - Division by zero (#SAYI/0!)
 * - Syntax/Value/Ref errors (#HATA!, #DEĞER!, #AD?, #BAŞV!)
 */

import { parseRange, getAddressesInRange, addressToCell, parseCellReference } from '../../utils/cellAddress.ts';
import { parseNumeric, isNumeric } from '../../utils/validation.ts';
import type { CellData, Worksheet } from './types.ts';

export interface EvaluationResult {
  value: string | number | boolean | null;
  error?: string;
}

// Token Types
type TokenType =
  | 'NUMBER'
  | 'STRING'
  | 'IDENTIFIER' // Function name or cell reference or keyword
  | 'OPERATOR' // +, -, *, /, ^, =, <>, !=, <, <=, >, >=
  | 'COMMA' // , or ;
  | 'COLON' // :
  | 'LPAREN' // (
  | 'RPAREN' // )
  | 'EOF';

interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

/**
 * Tokenizer for Excel formulas
 */
function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = input.length;

  while (i < len) {
    const char = input[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // String literals: "hello"
    if (char === '"') {
      const start = i;
      i++; // skip open quote
      let strVal = '';
      while (i < len && input[i] !== '"') {
        if (input[i] === '\\' && i + 1 < len) {
          i++;
          strVal += input[i];
        } else {
          strVal += input[i];
        }
        i++;
      }
      i++; // skip closing quote
      tokens.push({ type: 'STRING', value: strVal, pos: start });
      continue;
    }

    // Numbers: 123, 123.45, .5
    if (/[0-9]/.test(char) || (char === '.' && i + 1 < len && /[0-9]/.test(input[i + 1]))) {
      const start = i;
      let numStr = '';
      let hasDot = false;
      while (i < len && (/[0-9]/.test(input[i]) || (input[i] === '.' && !hasDot))) {
        if (input[i] === '.') hasDot = true;
        numStr += input[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr, pos: start });
      continue;
    }

    // Delimiters: , or ;
    if (char === ',' || char === ';') {
      tokens.push({ type: 'COMMA', value: char, pos: i });
      i++;
      continue;
    }

    // Colon : for ranges
    if (char === ':') {
      tokens.push({ type: 'COLON', value: ':', pos: i });
      i++;
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(', pos: i });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')', pos: i });
      i++;
      continue;
    }

    // Comparison multi-char operators: <=, >=, <>, !=
    if (i + 1 < len) {
      const two = input.slice(i, i + 2);
      if (two === '<=' || two === '>=' || two === '<>' || two === '!=') {
        tokens.push({ type: 'OPERATOR', value: two === '!=' ? '<>' : two, pos: i });
        i += 2;
        continue;
      }
    }

    // Single-char operators: +, -, *, /, ^, <, >, =
    if (/[+\-*/^<>=]/.test(char)) {
      tokens.push({ type: 'OPERATOR', value: char, pos: i });
      i++;
      continue;
    }

    // Cell references with $ (e.g. $A$1, $A1, A$1) or identifiers (TOPLA, B2, etc.)
    if (char === '$' || /[a-zA-Z_ÇĞİÖŞÜçğıöşü]/.test(char)) {
      const start = i;
      let ident = '';
      while (i < len && (/[a-zA-Z0-9_ÇĞİÖŞÜçğıöşü$]/.test(input[i]))) {
        ident += input[i];
        i++;
      }
      tokens.push({ type: 'IDENTIFIER', value: ident.toUpperCase(), pos: start });
      continue;
    }

    // Unrecognized character
    i++;
  }

  tokens.push({ type: 'EOF', value: '', pos: len });
  return tokens;
}

// AST Node Types
type ASTNode =
  | { type: 'Literal'; value: string | number | boolean }
  | { type: 'CellRef'; address: string }
  | { type: 'RangeRef'; rangeStr: string; addresses: string[] }
  | { type: 'UnaryOp'; op: string; expr: ASTNode }
  | { type: 'BinaryOp'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'FunctionCall'; name: string; args: ASTNode[] };

/**
 * Safe Recursive-Descent Parser for Excel expressions
 */
class FormulaParser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '', pos: 0 };
  }

  private match(...types: TokenType[]): Token | null {
    const token = this.peek();
    if (types.includes(token.type)) {
      this.current++;
      return token;
    }
    return null;
  }

  private expect(type: TokenType, errMessage: string): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new Error(errMessage);
    }
    this.current++;
    return token;
  }

  public parse(): ASTNode {
    const node = this.parseComparison();
    if (this.peek().type !== 'EOF') {
      throw new Error('Formül sonunda beklenmeyen karakterler');
    }
    return node;
  }

  // Comparison: =, <>, <, <=, >, >=
  private parseComparison(): ASTNode {
    let left = this.parseAdditive();

    while (
      this.peek().type === 'OPERATOR' &&
      ['=', '<>', '<', '<=', '>', '>='].includes(this.peek().value)
    ) {
      const opToken = this.tokens[this.current++];
      const right = this.parseAdditive();
      left = { type: 'BinaryOp', op: opToken.value, left, right };
    }

    return left;
  }

  // Additive: +, -
  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();

    while (this.peek().type === 'OPERATOR' && ['+', '-'].includes(this.peek().value)) {
      const opToken = this.tokens[this.current++];
      const right = this.parseMultiplicative();
      left = { type: 'BinaryOp', op: opToken.value, left, right };
    }

    return left;
  }

  // Multiplicative: *, /
  private parseMultiplicative(): ASTNode {
    let left = this.parseExponentiation();

    while (this.peek().type === 'OPERATOR' && ['*', '/'].includes(this.peek().value)) {
      const opToken = this.tokens[this.current++];
      const right = this.parseExponentiation();
      left = { type: 'BinaryOp', op: opToken.value, left, right };
    }

    return left;
  }

  // Exponentiation: ^ (right-associative)
  private parseExponentiation(): ASTNode {
    const left = this.parseUnary();

    if (this.peek().type === 'OPERATOR' && this.peek().value === '^') {
      this.tokens[this.current++];
      const right = this.parseExponentiation(); // right-associative recursion
      return { type: 'BinaryOp', op: '^', left, right };
    }

    return left;
  }

  // Unary: +, -
  private parseUnary(): ASTNode {
    if (this.peek().type === 'OPERATOR' && (this.peek().value === '-' || this.peek().value === '+')) {
      const op = this.tokens[this.current++].value;
      const operand = this.parseUnary();
      return { type: 'UnaryOp', op, expr: operand };
    }

    return this.parsePrimary();
  }

  // Primary: Number, String, FunctionCall, Range, CellRef, Parenthesized Expr
  private parsePrimary(): ASTNode {
    const token = this.peek();

    if (token.type === 'NUMBER') {
      this.current++;
      return { type: 'Literal', value: parseNumeric(token.value) };
    }

    if (token.type === 'STRING') {
      this.current++;
      return { type: 'Literal', value: token.value };
    }

    if (token.type === 'LPAREN') {
      this.current++; // skip (
      const expr = this.parseComparison();
      this.expect('RPAREN', "Kapatılmamış parantez: ')' bekleniyor");
      return expr;
    }

    if (token.type === 'IDENTIFIER') {
      const identToken = this.tokens[this.current++];

      // Check if function call: IDENTIFIER(
      if (this.peek().type === 'LPAREN') {
        this.current++; // skip (
        const args: ASTNode[] = [];

        if (this.peek().type !== 'RPAREN') {
          while (true) {
            args.push(this.parseComparison());
            if (this.peek().type === 'COMMA') {
              this.current++;
            } else {
              break;
            }
          }
        }
        this.expect('RPAREN', `Fonksiyon parantezi kapatılmadı: ')' bekleniyor (${identToken.value})`);
        return { type: 'FunctionCall', name: identToken.value, args };
      }

      // Check if range: IDENTIFIER : IDENTIFIER (e.g. B2:B6)
      if (this.peek().type === 'COLON') {
        this.current++; // skip :
        const secondIdent = this.expect('IDENTIFIER', "İki nokta üst üste sonrasında geçerli hücre adresi bekleniyor");
        const rangeStr = `${identToken.value}:${secondIdent.value}`;
        const range = parseRange(rangeStr.replace(/\$/g, ''));
        if (range) {
          return {
            type: 'RangeRef',
            rangeStr,
            addresses: getAddressesInRange(range),
          };
        }
      }

      // Single Cell Reference or Range if identifier itself contained colon
      const cleanRef = identToken.value.replace(/\$/g, '');
      const parsedCell = addressToCell(cleanRef);
      if (parsedCell) {
        return { type: 'CellRef', address: cleanRef };
      }

      // Boolean constants: DOĞRU / TRUE, YANLIŞ / FALSE
      if (identToken.value === 'DOĞRU' || identToken.value === 'TRUE') {
        return { type: 'Literal', value: true };
      }
      if (identToken.value === 'YANLIŞ' || identToken.value === 'FALSE') {
        return { type: 'Literal', value: false };
      }

      throw new Error(`Geçersiz fonksiyon veya hücre adı: ${identToken.value}`);
    }

    throw new Error(`Beklenmeyen ifade veya sözdizimi hatası: ${token.value || 'boşluk'}`);
  }
}

/**
 * Normalizes function name (maps Turkish & English names to canonical key)
 */
function normalizeFunctionName(name: string): string {
  const upper = name.toUpperCase();
  switch (upper) {
    case 'TOPLA':
    case 'SUM':
      return 'SUM';
    case 'ORTALAMA':
    case 'AVERAGE':
      return 'AVERAGE';
    case 'MAK':
    case 'MAX':
      return 'MAX';
    case 'MİN':
    case 'MIN':
      return 'MIN';
    case 'SAY':
    case 'COUNT':
      return 'COUNT';
    case 'BAĞ_DEĞ_DOLU_SAY':
    case 'BAG_DEG_DOLU_SAY':
    case 'COUNTA':
      return 'COUNTA';
    case 'EĞER':
    case 'EGER':
    case 'IF':
      return 'IF';
    default:
      return upper;
  }
}

/**
 * Extracts all cell addresses referenced by an AST node
 */
export function extractReferencedAddresses(node: ASTNode): string[] {
  switch (node.type) {
    case 'Literal':
      return [];
    case 'CellRef':
      return [node.address];
    case 'RangeRef':
      return node.addresses;
    case 'UnaryOp':
      return extractReferencedAddresses(node.expr);
    case 'BinaryOp':
      return [
        ...extractReferencedAddresses(node.left),
        ...extractReferencedAddresses(node.right),
      ];
    case 'FunctionCall':
      return node.args.flatMap(extractReferencedAddresses);
  }
}

/**
 * Evaluates an AST Node safely using worksheet cells
 */
function evaluateAST(
  node: ASTNode,
  cells: Record<string, CellData>,
  evaluatingStack: Set<string>
): any {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'CellRef': {
      const addr = node.address;
      if (evaluatingStack.has(addr)) {
        throw new Error('#DÖNGÜ!');
      }

      const cell = cells[addr];
      if (!cell || cell.computed === null || cell.computed === undefined || cell.computed === '') {
        return 0; // In arithmetic, blank cell is treated as 0
      }
      if (cell.computed === '#DÖNGÜ!' || cell.error?.includes('Döngü') || cell.error === '#DÖNGÜ!') {
        throw new Error('#DÖNGÜ!');
      }
      if (cell.error) {
        throw new Error(cell.error);
      }
      return cell.computed;
    }

    case 'RangeRef': {
      // Return array of cell values
      return node.addresses.map((addr) => {
        if (evaluatingStack.has(addr)) {
          throw new Error('#DÖNGÜ!');
        }
        const cell = cells[addr];
        if (!cell || cell.computed === null || cell.computed === undefined || cell.computed === '') {
          return null;
        }
        if (cell.error) throw new Error(cell.error);
        return cell.computed;
      });
    }

    case 'UnaryOp': {
      const val = evaluateAST(node.expr, cells, evaluatingStack);
      if (typeof val === 'number') {
        return node.op === '-' ? -val : +val;
      }
      if (isNumeric(val)) {
        const num = parseNumeric(val);
        return node.op === '-' ? -num : +num;
      }
      throw new Error('#DEĞER!');
    }

    case 'BinaryOp': {
      const leftVal = evaluateAST(node.left, cells, evaluatingStack);
      const rightVal = evaluateAST(node.right, cells, evaluatingStack);

      // Comparisons: =, <>, <, <=, >, >=
      if (['=', '<>', '<', '<=', '>', '>='].includes(node.op)) {
        const leftNum = isNumeric(leftVal) ? parseNumeric(leftVal) : null;
        const rightNum = isNumeric(rightVal) ? parseNumeric(rightVal) : null;

        if (leftNum !== null && rightNum !== null) {
          switch (node.op) {
            case '=':
              return leftNum === rightNum;
            case '<>':
              return leftNum !== rightNum;
            case '<':
              return leftNum < rightNum;
            case '<=':
              return leftNum <= rightNum;
            case '>':
              return leftNum > rightNum;
            case '>=':
              return leftNum >= rightNum;
          }
        }

        // String comparison
        const sLeft = String(leftVal ?? '');
        const sRight = String(rightVal ?? '');
        switch (node.op) {
          case '=':
            return sLeft.toLowerCase() === sRight.toLowerCase();
          case '<>':
            return sLeft.toLowerCase() !== sRight.toLowerCase();
          case '<':
            return sLeft < sRight;
          case '<=':
            return sLeft <= sRight;
          case '>':
            return sLeft > sRight;
          case '>=':
            return sLeft >= sRight;
        }
      }

      // Arithmetic operations
      const n1 = isNumeric(leftVal) ? parseNumeric(leftVal) : 0;
      const n2 = isNumeric(rightVal) ? parseNumeric(rightVal) : 0;

      switch (node.op) {
        case '+':
          return n1 + n2;
        case '-':
          return n1 - n2;
        case '*':
          return n1 * n2;
        case '/':
          if (n2 === 0) throw new Error('#SAYI/0!');
          return n1 / n2;
        case '^':
          return Math.pow(n1, n2);
        default:
          throw new Error('#HATA!');
      }
    }

    case 'FunctionCall': {
      const fnName = normalizeFunctionName(node.name);

      // EĞER / IF(condition, valueIfTrue, valueIfFalse)
      if (fnName === 'IF') {
        if (node.args.length < 2 || node.args.length > 3) {
          throw new Error('#DEĞER!');
        }
        const condition = evaluateAST(node.args[0], cells, evaluatingStack);
        const isTrue =
          condition === true ||
          (typeof condition === 'number' && condition !== 0) ||
          (typeof condition === 'string' && condition.length > 0 && condition !== '0' && condition !== 'FALSE');

        if (isTrue) {
          return evaluateAST(node.args[1], cells, evaluatingStack);
        } else {
          return node.args.length === 3
            ? evaluateAST(node.args[2], cells, evaluatingStack)
            : false;
        }
      }

      // Flatten arguments for aggregate functions (SUM, AVERAGE, MIN, MAX, COUNT, COUNTA)
      const rawArgValues = node.args.map((a) => evaluateAST(a, cells, evaluatingStack));
      const flattened: any[] = [];
      const flatten = (val: any) => {
        if (Array.isArray(val)) {
          val.forEach(flatten);
        } else {
          flattened.push(val);
        }
      };
      rawArgValues.forEach(flatten);

      switch (fnName) {
        case 'SUM': {
          let sum = 0;
          for (const item of flattened) {
            if (isNumeric(item)) {
              sum += parseNumeric(item);
            }
          }
          return sum;
        }

        case 'AVERAGE': {
          let sum = 0;
          let count = 0;
          for (const item of flattened) {
            if (isNumeric(item)) {
              sum += parseNumeric(item);
              count++;
            }
          }
          if (count === 0) throw new Error('#SAYI/0!');
          return Math.round((sum / count) * 100) / 100;
        }

        case 'MAX': {
          const nums = flattened.filter(isNumeric).map(parseNumeric);
          if (nums.length === 0) return 0;
          return Math.max(...nums);
        }

        case 'MIN': {
          const nums = flattened.filter(isNumeric).map(parseNumeric);
          if (nums.length === 0) return 0;
          return Math.min(...nums);
        }

        case 'COUNT': {
          return flattened.filter(isNumeric).length;
        }

        case 'COUNTA': {
          return flattened.filter((item) => item !== null && item !== undefined && item !== '').length;
        }

        default:
          throw new Error(`#AD?`);
      }
    }
  }
}

/**
 * Evaluates a single formula string e.g. "=TOPLA(B2:B6)" or "=B2+B3" or "=EĞER(B2>100; 1; 0)"
 */
export function evaluateFormula(
  formula: string,
  cells: Record<string, CellData>,
  evaluatingStack: Set<string> = new Set()
): EvaluationResult {
  if (!formula.startsWith('=')) {
    if (isNumeric(formula)) {
      return { value: parseNumeric(formula) };
    }
    return { value: formula };
  }

  const rawExpression = formula.slice(1).trim();
  if (!rawExpression) {
    return { value: '' };
  }

  try {
    const tokens = tokenize(rawExpression);
    const parser = new FormulaParser(tokens);
    const ast = parser.parse();
    const result = evaluateAST(ast, cells, evaluatingStack);

    if (typeof result === 'number') {
      if (isNaN(result) || !isFinite(result)) {
        return { value: '#SAYI/0!', error: 'Sayısal taşma veya sıfıra bölme' };
      }
      return { value: Math.round(result * 10000) / 10000 };
    }

    return { value: result };
  } catch (err: any) {
    const msg = err.message || '#HATA!';
    if (msg.startsWith('#')) {
      return { value: msg, error: msg };
    }
    return { value: '#HATA!', error: msg };
  }
}

/**
 * Topologically recalculates all cells in a worksheet in proper dependency order.
 * Handles circular dependency detection gracefully.
 */
export function recalculateWorksheet(sheet: Worksheet): Worksheet {
  const updatedCells: Record<string, CellData> = { ...sheet.cells };

  // First pass: resolve static literal values (no formulas)
  for (const [addr, cell] of Object.entries(updatedCells)) {
    if (!cell.raw.startsWith('=')) {
      updatedCells[addr] = {
        ...cell,
        computed: isNumeric(cell.raw) ? parseNumeric(cell.raw) : cell.raw,
        error: undefined,
      };
    }
  }

  // Parse AST for each formula cell and build dependency map
  const formulaCells: Record<string, ASTNode | null> = {};
  const dependencies: Record<string, string[]> = {};

  for (const [addr, cell] of Object.entries(updatedCells)) {
    if (cell.raw.startsWith('=')) {
      try {
        const tokens = tokenize(cell.raw.slice(1).trim());
        const parser = new FormulaParser(tokens);
        const ast = parser.parse();
        formulaCells[addr] = ast;
        dependencies[addr] = extractReferencedAddresses(ast);
      } catch (err: any) {
        formulaCells[addr] = null;
        dependencies[addr] = [];
        updatedCells[addr] = {
          ...cell,
          computed: err.message?.startsWith('#') ? err.message : '#HATA!',
          error: err.message,
        };
      }
    }
  }

  // Evaluate formula cells with circular reference check
  const evaluated = new Set<string>();
  const visiting = new Set<string>();
  const cycleCells = new Set<string>();

  function evaluateCell(addr: string) {
    if (evaluated.has(addr)) return;
    if (visiting.has(addr)) {
      // Circular reference detected! Mark all current visiting cells
      for (const node of visiting) {
        cycleCells.add(node);
        const cell = updatedCells[node];
        if (cell) {
          updatedCells[node] = {
            ...cell,
            computed: '#DÖNGÜ!',
            error: '#DÖNGÜ!',
          };
        }
      }
      return;
    }

    visiting.add(addr);

    // Evaluate dependencies first
    const deps = dependencies[addr] || [];
    for (const dep of deps) {
      if (cycleCells.has(dep)) {
        cycleCells.add(addr);
        const cell = updatedCells[addr];
        if (cell) {
          updatedCells[addr] = {
            ...cell,
            computed: '#DÖNGÜ!',
            error: '#DÖNGÜ!',
          };
        }
        break;
      }
      if (updatedCells[dep] && updatedCells[dep].raw.startsWith('=')) {
        evaluateCell(dep);
      }
    }

    visiting.delete(addr);
    evaluated.add(addr);

    if (cycleCells.has(addr)) {
      return;
    }

    const ast = formulaCells[addr];
    const cell = updatedCells[addr];
    if (cell && ast) {
      try {
        const result = evaluateAST(ast, updatedCells, new Set([addr]));
        updatedCells[addr] = {
          ...cell,
          computed: typeof result === 'number' ? Math.round(result * 10000) / 10000 : result,
          error: undefined,
        };
      } catch (err: any) {
        const msg = err.message || '#HATA!';
        updatedCells[addr] = {
          ...cell,
          computed: msg.startsWith('#') ? msg : '#HATA!',
          error: msg,
        };
      }
    }
  }

  for (const addr of Object.keys(formulaCells)) {
    evaluateCell(addr);
  }

  return {
    ...sheet,
    cells: updatedCells,
  };
}
