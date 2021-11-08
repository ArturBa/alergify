process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import AuthRoute from '@routes/auth.route';
import FoodLogsRoute from '@/routes/food-log.route';
import IndexRoute from '@routes/index.route';
import IngredientRoute from '@routes/ingredient.route';
import ProductRoute from '@routes/product.route';
import UserRoute from '@routes/user.route';
import UsersRoute from '@routes/users.route';
import SymptomsRoute from '@routes/symptom.route';

import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new FoodLogsRoute(),
  new IngredientRoute(),
  new ProductRoute(),
  new UserRoute(),
  new IngredientRoute(),
  new SymptomsRoute(),
]);

app.listen();
