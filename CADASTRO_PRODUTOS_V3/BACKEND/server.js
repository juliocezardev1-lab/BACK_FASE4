const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;


// BANCO DE DADOS

const pastaBanco = path.join(__dirname, 'DATA');

if (!fs.existsSync(pastaBanco)) {
    fs.mkdirSync(pastaBanco, { recursive: true });
}

const caminhoBanco = path.join(pastaBanco, 'estoque.db');

const db = new sqlite3.Database(caminhoBanco);


// CRIAÇÃO DA TABELA

db.run(`
    CREATE TABLE IF NOT EXISTS produtos(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL NOT NULL,
        quantidade INTEGER NOT NULL
    )
`);


// MIDDLEWARES

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, '../FRONTEND')));


// ROTA PRINCIPAL

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, '../FRONTEND/index.html')
    );
});


// BUSCAR PRODUTOS

app.get('/produtos', (req, res) => {

    db.all(
        'SELECT * FROM produtos',
        [],
        (erro, produtos) => {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao buscar produtos'
                });
            }

            res.status(200).json(produtos);
        }
    );
});


// CADASTRAR PRODUTO

app.post('/produtos', (req, res) => {

    const { nome, preco, quantidade } = req.body;

    const p = parseFloat(preco);
    const q = parseInt(quantidade);

    if (
        !nome ||
        isNaN(p) ||
        isNaN(q) ||
        p <= 0 ||
        q <= 0
    ) {
        return res.status(400).json({
            erro: 'Dados inválidos enviados para o servidor'
        });
    }

    db.run(
        `
        INSERT INTO produtos
        (nome, preco, quantidade)
        VALUES (?, ?, ?)
        `,
        [nome, p, q],

        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao cadastrar produto'
                });
            }

            const novoItem = {
                id: this.lastID,
                nome,
                preco: p,
                quantidade: q
            };

            res.status(201).json(novoItem);
        }
    );
});


// APAGAR TODOS OS PRODUTOS

app.delete('/produtos', (req, res) => {

    db.run(
        'DELETE FROM produtos',

        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao limpar produtos'
                });
            }

            res.status(204).send();
        }
    );
});


// APAGAR UM PRODUTO PELO ID

app.delete('/produtos/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: 'ID inválido'
        });
    }

    db.run(
        'DELETE FROM produtos WHERE id = ?',
        [id],

        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao apagar produto'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: 'Produto não encontrado'
                });
            }

            res.status(204).send();
        }
    );
});


// INICIALIZAÇÃO

app.listen(PORT, () => {
    console.log(
        `Servidor backend rodando em http://localhost:${PORT}`
    );
});