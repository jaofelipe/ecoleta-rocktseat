import express from 'express';

const routes = express();

routes.get('/', (req, res) =>{
    res.json([ 'João Felipe', 'Aline', 'Rita', 'Ilcea']);
});

export default routes;