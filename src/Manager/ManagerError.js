class ErroPersonalizado extends Error {
    constructor(codigo, mensagem){
        super(mensagem)
        this.codigo = codigo
    }
}

class GerenciadorErro {
    criarErro(codigo, mensagem) {
        if (!codigo || !mensagem) {
            throw new ErroPersonalizado('190', 'Código e mensagem são obrigatórios para criar um erro!');
        }
    
        throw new ErroPersonalizado(codigo, mensagem);
    }
    

    exibirErro(erro){
        const mensagemErro = `Erro: ${erro.codigo} - ${erro.message}`
        console.error(mensagemErro, erro.stack)
    }

}

export const ManagerError = new GerenciadorErro()


