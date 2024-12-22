import { Produto } from "./Produto.js";
import fs from "fs/promises";

class Estoque {
    constructor(){
        this.estoque = [];
    }

    adicionarProduto(nome, marca, qtdDisponivel){
        const novoProduto = new Produto(this.validarId(), nome, marca, qtdDisponivel)

        try{
            const produtoDuplicado = this.estoque.find(produto => produto.nome === nome && produto.marca === marca)

            if(produtoDuplicado){
                throw new Error('ERRO - Produto duplicado!')
            }
            
            this.estoque.push(novoProduto)
            return novoProduto

        }catch(erro){
            return erro.message
        }
        
    }

    gerarId(){
        const data = Date.now().toString()
        
        const comeco = data.slice(5, 13)
        
        const intervalo = 100000
        const final = Math.floor(Math.random() * intervalo).toString().padStart(4, '0')
        
        const id = comeco + final
        
        return id
    }
    
    validarId(){
    
        let loop = true
    
        do{
            const idProduto = this.gerarId()

            const idDuplicado = this.estoque.find(produto => produto.id === idProduto)

            if(!idDuplicado){
                loop = false
                return idProduto
            }

        }while(loop)
    }

    deletarProduto(nome, marca){

        try{
            const produtoEncontrado = this.estoque.findIndex((produto) => {
                if(produto.nome === nome && produto.marca === marca){
                    return produto
                }
            })

            if(produtoEncontrado === -1){
                throw new Error('Produto não encontrado - Deleção cancelada')
            }

            this.estoque.splice(produtoEncontrado, 1)
            return `Produto deletado!`

        }catch(erro){
            return erro.message
        }
    }

    listarProdutos(){
        return this.estoque
    }

    atualizarQtdDisponivel(nome, marca, qtdNova){

        try{
            const produtoEncontrado = this.estoque.find(produto => produto.nome === nome && produto.marca === marca)

            if(!produtoEncontrado){
                throw new Error('Produto não encontrado')
            }
    
            produtoEncontrado.qtdDisponivel = qtdNova
            return produtoEncontrado

        }catch(erro){
            return erro.message
        }
    }

    async salvarEstoque(){
        try{
            await fs.writeFile('estoque.json', JSON.stringify(this.estoque)) 
            console.log('Arquivo Salvo!')

        }catch(erro){
            return erro
        }
   
    }

    async carregarEstoque() {
        try {

            const dados = await fs.readFile('estoque.json', 'utf-8');

            const dadosFormatados = await JSON.parse(dados);

            return dadosFormatados 

        } catch (erro) {
            console.error('Erro ao ler arquivo:', erro.message);
            return [];
        }
    }

}

(async () => {
    const estoque = new Estoque();

    // Carrega os dados do arquivo
    const dadosCarregados = await estoque.carregarEstoque();
    console.log('Dados carregados:', dadosCarregados);

    // Adiciona produtos ao estoque
    estoque.adicionarProduto('Cerveja', 'Gelato', 100);
    estoque.adicionarProduto('Cerveja', 'Bhrama', 150);
    estoque.adicionarProduto('Cerveja', 'Heineken', 200);
    estoque.adicionarProduto('Cerveja', 'Skol', 200);

    // Salva os novos dados no arquivo
    await estoque.salvarEstoque();
})();



