class Produto {
    #preco;
    #quantidade;


    constructor(nome, preco, quantidade) {
        if (!nome || preco <= 0 || quantidade <= 0) {
            throw new Error("Dados inválidos para o produto");
        }
        this.nome = nome;

        this.#preco = parseFloat(preco);
        this.#quantidade = parseInt(quantidade);
    }
    get preco() {
        return this.#preco;
    }
    get quantidade() {
        return this.#quantidade;
    }

    valorTotal() {
        return this.#preco * this.#quantidade;
    }

    //método tojson
    toJSON() {
        return {
            nome: this.nome,
            preco: this.#preco,
            quantidade: this.#quantidade
        };
    }
}

// const produtos = [];
// mudança de arquitetura - cliente-servidor

// criar uma constante com endereço de api (rodando no servidor)
const API_URL = 'http://localhost:3000/produtos';

// requisição post - enviar dados para o servidor
// função deve ser async pois o envio e a resposta trafegam pela rede
// usar await até que o servidor responda


document.getElementById("produto-form").addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const quantidade = document.getElementById('quantidade').value;

    try {
        const novoProduto = new Produto(nome, preco, quantidade);

        // produtos.push(novoProduto);

        // envio na rede: envia o produto convertido em texto json para o express

        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoProduto.toJSON())
        });

        if (!resposta.ok) {
            const erroDoServidor = await resposta.json().catch(() => null);
            throw new Error(erroDoServidor?.erro || 'Erro ao salvar o produto no servidor backend');
        }

        renderizarTabela();
        e.target.reset();


    } catch (erro) {
        alert(erro.message);
    }
}); //PAREI AQUI

// requisição get (buscar um servidor e desenhar tela)
// o coração da proposta ocorre aqui

async function renderizarTabela() {

    try {

        // buscar dados
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Não foi possível buscar os produtos no servidor');
        }

        const dadosBrutosDoServidor = await resposta.json();

        if (!Array.isArray(dadosBrutosDoServidor)) {
            throw new Error('Resposta inválida recebida do servidor');
        }

        const tabela = document.querySelector('#tabela-produtos tbody');
        tabela.innerHTML = '';
        let totalAcumulado = 0;

        // percorre cada item retornado pelo backend
        dadosBrutosDoServidor.forEach((dados, index) => {
            const produto = new Produto(dados.nome, dados.preco, dados.quantidade);
            totalAcumulado += produto.valorTotal();
            // desenha a linha na tabela com os dados do objeto
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${produto.nome}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${produto.valorTotal().toFixed(2)}</td>
                <td><button type="button" data-index="${index}">Apagar</button></td>
            `;

            const botao = row.querySelector('button');
            botao.addEventListener('click', () => deletarProduto(index));

            tabela.appendChild(row);
        });

        // atualiza o texto com o valor total acumulado
        document.getElementById('total-estoque').textContent = `Total em estoque: R$ ${totalAcumulado.toFixed(2)}`;
    } catch (erro) {
        console.error("Erro ao buscar dados no servidor:", erro);
    }
};

async function deletarProduto(index) {
    if (index === undefined || index < 0) return;

    try {
        const resposta = await fetch(`${API_URL}/${index}`, { method: 'DELETE' });

        if (!resposta.ok) {
            throw new Error('Erro ao apagar o produto');
        }

        renderizarTabela();
    } catch (erro) {
        console.error('Erro ao apagar produto:', erro);
    }
}

// requisição para delete (apagar os dados em lote)
document.getElementById('limpar-tabela').addEventListener('click', async function () {
    try {
        // envia uma ordem de remoção para a api
        await fetch(API_URL, { method: 'DELETE' });

        // atualiza a tabela
        renderizarTabela();
    } catch (erro) {
        console.error("erro ao limpar dados no servidor:", erro);
    }
});

// inicialização automática
// assim que o usuário abre o navegador, o app busca
// se já há dados salvos de sessões anteriores lá no backend
renderizarTabela();


