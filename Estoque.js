import { Produto } from "./Produto.js";
import fs from "fs/promises";

class Estoque {
    constructor(arquivo){
        this.arquivo = arquivo
        this.listArquivo = []
    }

    async carregarEstoque(){
        try{
            const dados = await fs.readFile(this.arquivo, 'utf-8');
            return this.listArquivo = JSON.parse(dados)

        }catch(erro){
            if(erro.code === 'ENOENT'){
                return this.listArquivo = []
            } else{
                console.log(erro)
                return erro
            }
            
        }
    }

    async salvarDados(){
        try{
            await fs.writeFile(this.arquivo, JSON.stringify(this.listArquivo))
            console.log('Arquivo salvo!')
        }catch(erro){
            console.log(erro)
            return erro
        }
    }

    async listarProdutos(){
        const conteudo = this.listArquivo
        return conteudo
    }

    async adicionarProduto(nome, marca, qtdDisponivel){

        try{
            
            const novoProduto = new Produto(await this.validarId(), nome, marca, qtdDisponivel)

            const listaProdutosEmMemoria = await this.listarProdutos()

            const produtoDuplicado = listaProdutosEmMemoria.find(produto => produto.nome === novoProduto.nome && produto.marca === novoProduto.marca)
            
            if(produtoDuplicado){
                throw new Error('Produto duplicado!')
            } else{
                this.listArquivo.push(novoProduto)
                console.log('Produto adicionado!')
            }

        }catch(erro){
            console.log(erro)
            return erro
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

    async validarId(){
        
        let loop = true;
    
        do{
            const idGerado = this.gerarId()

            const listaProdutosEmMemoria = await this.listarProdutos()

            const idDuplicado = listaProdutosEmMemoria.find(produto => produto.id === idGerado)

            if(!idDuplicado){
                loop = false
                return idGerado
            }
    
        }while(loop)

    }

    async deletarProduto(id){
        try{

            const listaProdutosEmMemoria = await this.listarProdutos()

            const produtoEncontrado = listaProdutosEmMemoria.findIndex(produto => produto.id === id)

            if(produtoEncontrado === -1){
                throw new Error('Produto não encontrado!')
            }else{
                listaProdutosEmMemoria.splice(produtoEncontrado, 1)
                console.log('Produto Deletado!')
            }

        }catch(erro){
            console.log(erro)
            return erro
        }
    }


}

(async () => {
    try{
        const app = new Estoque('estoque.json')
    
        await app.carregarEstoque()
    
        await app.deletarProduto('8827900796467')
        
        console.log(await app.listarProdutos())

        await app.salvarDados()


    }catch(erro){
        console.log(erro)
        return erro
    }

})()
