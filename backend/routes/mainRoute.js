const users = require('./userRoute');
const incomes = require('./incomeRoute');
const expenses = require('./expenseRoute');
const categories = require('./categoryRoute');
const goals = require('./goalRoute');
function routes(app){
  app.use('/',users);
  app.use('/incomes',incomes);
  app.use('/expenses',expenses);
  app.use('/categories',categories);
  app.use('/goals',goals);
}
module.exports = routes