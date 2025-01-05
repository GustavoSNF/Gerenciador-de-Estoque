import { app } from "../Services/EstoqueService.js";

async function gerenciarEstoque(){
    
    await app.carregarEstoque()

    console.log(await app.listarProdutos())
        
}

gerenciarEstoque()