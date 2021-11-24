import 'dotenv/config';

import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import IngredientRoute from '@routes/ingredient.route';
import ProductRoute from '@routes/product.route';
import SymptomLogsRoute from '@routes/symptom-log.route';
import SymptomsRoute from '@routes/symptom.route';
import UserRoute from '@routes/user.route';
import UsersRoute from '@routes/users.route';

import validateEnv from '@utils/validateEnv';
import FoodLogsRoute from '@/routes/food-log.route';
import App from '@/app';

process.env.NODE_CONFIG_DIR = `${__dirname}/configs`;

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
  new SymptomLogsRoute(),
]);

app.listen();
