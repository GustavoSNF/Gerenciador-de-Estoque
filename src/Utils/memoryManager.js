import { ManagerError } from '../Manager/ManagerError.js';
import fs from 'fs/promises';

export const memoryManager = {

    async carregarDados(arquivo){

        try{
            const dados = await fs.readFile(arquivo, 'utf-8');
            const dadosFormatados = dados.trim() ? JSON.parse(dados) : [];
            return dadosFormatados

        }catch(erro){
            if(erro.code === 'ENOENT'){
                return []
            }
            ManagerError.exibirErro(erro)
        }
    },

    async salvarDados(arquivo, dados){
        try{
            await fs.writeFile(arquivo, JSON.stringify(dados, null, 2));
            console.log('Arquivo Salvo')

        }catch(erro){
            ManagerError.exibirErro(erro)
        }
    },

    gerarId(){
        const data = Date.now().toString()
        const comeco = data.slice(5, 13)
        const intervalo = 100000
        const final = Math.floor(Math.random() * intervalo).toString().padStart(4, '0')
        const id = comeco + final
        return id
    },

    async validarId(lista){
        
        let loop = true;
        
        do{
            const idGerado = this.gerarId()
            const listaDadosEmMemoria = await this.listarDados(lista)
            const idDuplicado = listaDadosEmMemoria.find(dado => dado.id === idGerado)

            if(!idDuplicado){
                loop = false
                return idGerado
            }
    
        }while(loop)
    },

    async listarDados(lista){
        const conteudo = lista
        return conteudo
    }
}
