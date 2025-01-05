import { memoryManager } from "../Utils/memoryManager.js";
import { ManagerError } from "../Manager/ManagerError.js";
import { Produto } from "../models/Produto.js";

class EstoqueService{
    constructor(arquivo){
        this.arquivo = arquivo
        this.produtosEmMemoria = []
    }

    async carregarProdutos(){
        this.produtosEmMemoria = await memoryManager.carregarDados(this.arquivo)
        return this.produtosEmMemoria;
    }

    async salvarProdutos(){
        try{
            await memoryManager.salvarDados(this.arquivo, this.produtosEmMemoria)
        }catch(erro){
            ManagerError.exibirErro(erro)
        }
    }

    async listarProdutos(){
        return await memoryManager.listarDados(this.produtosEmMemoria)
    }

    async adicionarProduto(nome, marca, qtdDisponivel){
        
        try{ 
            const novoProduto = new Produto(await memoryManager.validarId(this.produtosEmMemoria), nome, marca, qtdDisponivel)

            const produtosExistentes = await this.listarProdutos()

            const produtoDuplicado = produtosExistentes.find(produto => produto.nome === novoProduto.nome && produto.marca === novoProduto.marca)
            
            if(produtoDuplicado){
                ManagerError.criarErro('112', "Produto já existente na base de dados!")
            } else{
                this.produtosEmMemoria.push(novoProduto)
                console.log('Produto cadastrado!')
            }

        }catch(erro){
            ManagerError.exibirErro(erro)
        }
    }
}

const estoque = new EstoqueService('../data/estoque/estoque.json')

async function gerenciarEstoque(){

    await estoque.carregarProdutos()

    await estoque.adicionarProduto('Creme Capilar', 'Pantene', 20)
    await estoque.adicionarProduto('Creme Capilar', 'Skala', 20)
    await estoque.adicionarProduto('Creme Capilar', 'Polo', 20)
    await estoque.adicionarProduto('Creme Capilar', 'Polo', 20)

    console.log(await estoque.listarProdutos())

    await estoque.salvarProdutos()
}

gerenciarEstoque()