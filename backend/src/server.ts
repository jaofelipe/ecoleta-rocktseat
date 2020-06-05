import express from 'express';

const app = express();

app.get('/users', (req, res) =>{
    console.log('Listagem de usuários');

    res.json([ 'João Felipe', 'Aline', 'Rita', 'Ilcea']);
});

app.listen(3333);
