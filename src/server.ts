/* eslint-disable import/first */
process.env.NODE_CONFIG_DIR = `${__dirname}/configs`;
// eslint-disable-next-line import/first
import 'dotenv/config';
// eslint-disable-next-line import/order
import App from '@/app';

import AuthRoute from '@routes/auth.route';
import FoodLogsRoute from '@routes/food-log.route';
import FoodsRoute from '@routes/food.route';
import IndexRoute from '@routes/index.route';
import IngredientRoute from '@routes/ingredient.route';
import ProductRoute from '@routes/product.route';
import SymptomLogsRoute from '@routes/symptom-log.route';
import SymptomsRoute from '@routes/symptom.route';
import UserRoute from '@routes/user.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new FoodLogsRoute(),
  new FoodsRoute(),
  new IngredientRoute(),
  new ProductRoute(),
  new UserRoute(),
  new IngredientRoute(),
  new SymptomsRoute(),
  new SymptomLogsRoute(),
]);

app.listen();
