class Produto{
    #preco;
    #quantidade;
    constructor(nome, preco, quantidade){

        if(!nomde || preco<=0 || quantidade<=0){

            throw new Error("Dados inváslidos para o produto");
        }
        this.nome = nome;

        this.#preco = parseFloat(preco);

        this.#quantidade = parseInt(quantidade);

    }

        get preco(){
            return this.#preco;
        }
        get quantidade(){
            return this.#quantidade;
        }
        valorTotal(){
            return this.#preco * this.#quantidade;
        }
    }
    const produtos = [];

    document.getElementById("produto-form").addEventListener('submit', function(e){

        e.preventDefault();

        const mome = document.getElementById('nome').value;

        const preco = document.getElementById('preco').value;

        const quantidade = document.getElementById('quantidade').value;

        try{
        const novoProduto = new Produto(nome, preco, quantidade);

        produtos.push(novoProduto)

        }catch(erro){

        alert(erro.message);
        }

    })

    function renderizarTabela(){
        const tabela = document.querySelector('#tabela-produtos tbody');
        tablea.innerHTML = ' ';

        produtos.forEach((produto, index)=>{
            const row = document.createElement('tr');
            
            row.innerHTML=`
                <td>${produto.nome}</tb>
                <td>R$ ${produto.preco.toFixed(2)}</tb>
                <td>${produto.quantidade}</tb>
                <td></tb>
            `;

            const botaoRemover = document.createElement('button');
            botaoRemover.textContent = 'Remover';
            botaoRemover.addEventListener('click', ()=>removerProduto(index))

            row.querySelector('td: last-child').appendChild(botaoRemover);
            tabela.appendChild(row);
        })

        atualizarTotal();
    }

    function atualizarTotal(){
        const total = produtos.reduce((acc, p)=>acc + p.valorTotal(), 0);
        document.getElementById('total-estoque').textContent = `Total em estoque: R$ ${total.toFixed(2)}`;
    }

    function removerProduto(index){
        produtos.splice(index, 1);
    }

    document.getElementById('limpar-tabela').addEventListener('click', function(){
        produtos.lenght = 0;
        renderizarTabela();
    });