import { Produto } from "../models/Produto.js";
import fs from "fs/promises";
import { ManagerError } from "../Manager/ManagerError.js";

export class Estoque {
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
                ManagerError.exibirErro(erro)
            }
            
        }
    }

    async salvarDados(){
        try{
            await fs.writeFile(this.arquivo, JSON.stringify(this.listArquivo, null, 2))
            console.log('Arquivo salvo!')
        }catch(erro){
            ManagerError.exibirErro(erro)
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
                ManagerError.criarErro('112', "Produto Duplicado")
            } else{
                this.listArquivo.push(novoProduto)
                console.log('Produto adicionado!')
            }

        }catch(erro){
            ManagerError.exibirErro(erro)
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
                ManagerError.criarErro('130', 'Produto não encontrado!')
            }else{
                listaProdutosEmMemoria.splice(produtoEncontrado, 1)
                console.log('Produto Deletado!')
            }

        }catch(erro){
            ManagerError.exibirErro(erro)
        }
    }

    async alterarQtdDisponível(id, qtdNova) {
        try{
            const listaProdutosEmMemoria = await this.listarProdutos()

            const produtoEncontrado = listaProdutosEmMemoria.find(produto => produto.id === id)
    
            if(produtoEncontrado){
                console.log('Quantidade alterada!')
                produtoEncontrado.qtdDisponivel = qtdNova
                return produtoEncontrado
            } else{
                ManagerError.criarErro('130', 'Produto não encontrado!')
            }

        }catch(erro){
            ManagerError.exibirErro(erro)
        }
    }


}

export const app = new Estoque('src/data/estoque.json');


