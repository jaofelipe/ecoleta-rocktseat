import express from 'express';

const routes = express.Router();

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const pointController = new PointsController();
const itemController = new ItemsController();


// index, show, create, update, delete
routes.get('/items', itemController.index)
routes.get('/points/:id', pointController.show)
routes.get('/points', pointController.index);
routes.post('/points', pointController.create)

export default routes;