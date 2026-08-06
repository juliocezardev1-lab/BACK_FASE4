const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// serve arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../FRONTEND')));

// o banco de dados temporário (array na memória do servidor)
const bancoDEDadosProdutos = [];

// rota get: serve o arquivo html do frontend na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/index.html'));
});

// rota get: envia a lista de produtos salvos para a função renderizar tabela
app.get('/produtos', (req,res)=>{
    // envia dados brutos, o front recebe e reinstancia a classe
    res.status(200).json(bancoDEDadosProdutos);
});

// rota post: recebe o objeto json enviado pelo formulário do front
app.post('/produtos',(req,res)=>{
    const{nome, preco, quantidade} = req.body;

    const p = parseFloat(preco);
    const q = parseInt(quantidade);

    // validação de segurança no servidor, nunca confiar no cliente
    if(!nome || isNaN(p) || isNaN(q) || p <= 0 || q <= 0){
        return res.status(400).json({erro: "Dados inválidos enviados para o servidor"})
    }

    // monta o objeto que será guardado no array do servidor
    const novoItem = {
        nome,
        preco: p,
        quantidade: q
    };

    bancoDEDadosProdutos.push(novoItem);

    // responde com o status 201 created e o objeto criado
    res.status(201).json(novoItem); 
});

app.delete('/produtos', (req, res) => {
    bancoDEDadosProdutos.length = 0; //realiza o esvaziamento do array no servidor
    res.status(204).send(); //code 204 sucesso sem conteudo no retorno
});

app.delete('/produtos/:index', (req, res) => {
    const index = Number(req.params.index);

    if (!Number.isInteger(index) || index < 0 || index >= bancoDEDadosProdutos.length) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    bancoDEDadosProdutos.splice(index, 1);
    res.status(204).send();
});

// inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});

