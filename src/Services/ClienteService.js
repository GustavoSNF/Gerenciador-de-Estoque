import { ManagerError } from "../Manager/ManagerError.js";
import { Cliente } from "../models/Cliente.js";
import { memoryManager } from "../Utils/memoryManager.js";

class ClienteService{
    constructor(arquivo){
        this.arquivo = arquivo
        this.clienteEmMemoria = []
    }

    async carregarClientes(){
        this.clienteEmMemoria = await memoryManager.carregarDados(this.arquivo)
        return this.clienteEmMemoria;
    }

    async salvarClientes(){
        try{
            await memoryManager.salvarDados(this.arquivo, this.clienteEmMemoria)
        }catch(erro){
            ManagerError.exibirErro(erro)
        }
    }

    async listarClientes(){
        return await memoryManager.listarDados(this.clienteEmMemoria)
    }

    async adicionarCliente(nome, sobrenome, email, senha){
        
        try{ 
            const novoCliente = new Cliente(await memoryManager.validarId(this.clienteEmMemoria), nome, sobrenome, email, senha)

            const clientesExistentes = await this.listarClientes()

            const clienteDuplicado = clientesExistentes.find(cliente => cliente.nome === novoCliente.nome && cliente.sobrenome === novoCliente.sobrenome)
            
            if(clienteDuplicado){
                ManagerError.criarErro('122', "Cliente já existente na base de dados!")
            } else{
                this.clienteEmMemoria.push(novoCliente)
                console.log('Cliente cadastrado!')
            }

        }catch(erro){
            ManagerError.exibirErro(erro)
        }
    }
}


const cliente = new ClienteService('../data/clientes/clientes.json')

async function gerenciarClientes(){

    await cliente.carregarClientes()

    console.log(await cliente.listarClientes())
}

gerenciarClientes()