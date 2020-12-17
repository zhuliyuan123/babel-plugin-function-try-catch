const parser = require('@babel/parser');
const traverse = require("babel-traverse").default;
const t = require("babel-types");
const template = require("@babel/template");
const core = require("@babel/core");
const LIMIT_LINE = 0;


module.exports = function(source) {
  let ast = parser.parse(source,{
    sourceType: "module",
    plugins: ["dynamicImport"]
  })

  // 使用parse生成 ESTree为标准的AST语法树

  // 所有的函数都会走FunctionExpression
  traverse(ast,{
    FunctionExpression(path,state){
      // do same stuff
      const node = path.node,
      params = node.params,
      blockStatement = node.body,
      isGenerator = node.generator,
      isAsync = node.async;

      // t.isTryStatement(blockStatement.body[0])  如果有了try catch 包裹
      // 防止 circle loops  !t.isBlockStatement(blockStatement)
      // 如果函数内容小于多少行数  LIMIT_LINE


      if (blockStatement.body && t.isTryStatement(blockStatement.body[0])
        || !t.isBlockStatement(blockStatement) && !t.isExpressionStatement(blockStatement)
        || blockStatement.body && blockStatement.body.length <= LIMIT_LINE) {
        return;
      }



      var catchStatement = template.statement(`ErrorCapture(error)`)();
      var catchClause = t.catchClause(t.identifier('error'),
        t.blockStatement(
          [catchStatement] //  catchBody
        )
      );
      
      // 创建 try/catch 的 AST
      var tryStatement = t.tryStatement(blockStatement, catchClause);

      var func = t.functionExpression(node.id, params, t.BlockStatement([tryStatement]), isGenerator, isAsync);


      path.replaceWith(func); // 代替原来的节点
    }
  })
  
  //   core.transformFromAstSync  将AST树转化成代码
  return core.transformFromAstSync(ast, null, {
    configFile: false // 屏蔽 babel.config.js，否则会注入 polyfill 使得调试变得困难
  }).code;
};

