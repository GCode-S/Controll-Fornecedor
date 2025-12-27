
     //construção do DB
     export async function openDB(){
            return new Promise((res, rej) =>{

                const req = indexedDB.open("productControl", 1);

                req.onerror = (e) =>{
                    alert('Erro ao abrir Banco de Dados');
                    rej('erro ao abir db' + e);
                };

                req.onsuccess = (e) =>{
                    const db = e.target.result;
                    console.log("open DB");
                    res(db)
                };

                req.onupgradeneeded = (e) => {

                    const db = e.target.result;

                    if(!db.objectStoreNames.contains("fornecedor")){

                        var fornecedor = db.createObjectStore("fornecedor", {keyPath: "id", autoIncrement: true});

                            fornecedor.createIndex("nome", "nome", { unique: false});


                        var produtos = db.createObjectStore("produtos", {keyPath: "id", autoIncrement: true});

                            produtos.createIndex("idFornecedor", "idFornecedor", {unique: false});
                            produtos.createIndex("nome", "nome", {unique: false});
                            produtos.createIndex("quantidade", "quantidade", {unique: false});
                            produtos.createIndex("valor", "valor", {unique: false});
                            
                        console.log("DB criado com sucesso!")
                    }


                };
            })
        }

                    // --------------------------------------------------------------------


        //visualizar fornecedores

        export async function viewFornecedor(){
             const db = await openDB();

             return new Promise((res, rej) =>{


                const transaction = db.transaction(["fornecedor"], "readonly");
                const store = transaction.objectStore("fornecedor");

                const req = store.getAll();

                req.onsuccess = (e) =>{
                    res(e.target.result);
                }

                req.onerror = (e) =>{
                    rej("erro ao buscar dados");
                }

             })
        }

        //deleção de fornecedor


        export async function deleteFornecedor(id){
            const db = await openDB();
            
            return new Promise((res, rej) =>{

                var condition = confirm("Tem certeza que deseja deletar esse fornecedor?");

                if(condition){
                    

                    const tr = db.transaction(['produtos'], 'readwrite');
                    const str = tr.objectStore('produtos');
                    const idx = str.index("idFornecedor");

                    const r = str.openCursor();

                    r.onsuccess = (e) => {
                        const result = e.target.result;
                        if(result){

                            if(id == result.value.idFornecedor){
                                deleteProduct(result.value.id).then(res =>{
                                    res(res);
                                }).catch(e =>{
                                    rej(e);
                                });
                            }
                            
                            result.continue()
                           
                        }else{
                            console.log("Deletado todos os produtos desse usuário");

                            const trans = db.transaction(['fornecedor'], 'readwrite');
                            const stor = trans.objectStore('fornecedor');
            
                            const req = stor.delete(id);

                            req.onsuccess = (e) =>{
                                res("deletado com sucesso!");
                                alert("deletado com sucesso!");
                            }
            
                            req.onerror = (e) =>{
                                rej("erro ao deletar fornecedor!");
                                alert("erro ao deletar fornecedor!");
                                return
                            }

                            res(result);

                        }
                        
                    }

                    r.onerror = (e) =>{
                        return alert("Erro ao deletar os produtos desse fornecedor.")
                    }
  
                }else{
                    alert("Operação Cancelada!")
                }


               

            })
        }

        //criação de um fornecedor


        export async function addNewFornecedor(){

            const db = await openDB();

            return new Promise((res, rej) =>{

                var nome = prompt("digite o nome do fornecedor: ");

                if(nome == null){
                    return;
                }

                const transaction = db.transaction(["fornecedor"], "readwrite");
                const store = transaction.objectStore("fornecedor");
                const req =  store.add({nome});


                req.onsuccess = (e) =>{
                    console.log("fornecedor cadastrado.");
                    res(e.target.result);
                }

                req.onerror = (e) =>{
                    alert("erro ao adicionar fornecedor")
                
                }
            })
        }

        //update fornecedor

        export async  function updateFornecedor(id){
            const db = await openDB();

            return new Promise((res, rej) =>{

                var updateName = prompt("Digite o novo nome para este fornecedor: ");

                if(updateName == null){
                    return;
                }

                const tr = db.transaction(["fornecedor"], "readwrite");
                const str = tr.objectStore("fornecedor");
                const req = str.put({id, nome: updateName});

                req.onsuccess = (e) =>{
                    res("alterado com sucesso!")
                    alert("Nome alterado com sucesso!");
                }

                req.onerror = (e) =>{
                    rej(e);
                    alert("Erro ao alterar nome!");
                }


            })
        }



                    // --------------------------------------------------------------------

        //view products de um fornecedor

        export async function viewProductsF(id, batchSize, option){
            const db = await openDB();

            return new Promise((res, rej) =>{

               
               
                

                const trFornecedor = db.transaction(['fornecedor'], 'readonly');
                const strFornecedor = trFornecedor.objectStore('fornecedor');
                const reqFornecedor = strFornecedor.get(parseInt(id));


                let batch = [];
                let data = [];


                reqFornecedor.onsuccess = (e) =>{
                    
                    const resultFornecedor = e.target.result;

                    if(!resultFornecedor){
                        console.log("Erro no Id do fornecedor, parece que o mesmo não existe");
                        return;
                    }

                    const trProduct = db.transaction(['produtos'], 'readonly');
                    const strProduct = trProduct.objectStore('produtos');
                    const reqProduct = strProduct.openCursor();

                    reqProduct.onsuccess = (e) =>{

                        const result = e.target.result;

                        if(result){
                           
                            if(result.value.idFornecedor == id){

                                if(option == true){
                                    batch.push(result.value);

                                    if(batch.length === batchSize){
    
                                        data.push(...batch);
                                        batch = [];
    
                                    }
                                }else{

                                    if(result.value.quantidade > 0){

                                        batch.push(result.value);

                                        if(batch.length === batchSize){
        
                                            data.push(...batch);
                                            batch = [];
        
                                        }
                                    }


                                }

                               
                                
                            }

                            result.continue();

                        }else{
                            
                                if(batch.length > 0){
                                    data.push(...batch);
                                }
                                console.log(data);
                                res(data);
                        }
                    }

                }

                reqFornecedor.onerror = (e) =>{
                    console.log(e)
                }

            
        })
    }


        // add products

        export async function addProduct(id){
            const db = await openDB();

            return new Promise((res, rej) =>{

                try{

                
                const nomeProduct = prompt("Digite o nome do novo produto: ");

                if(nomeProduct == null || nomeProduct.length == 0 ){
                    return;
                }

                const trs = db.transaction(['produtos'], 'readwrite');
                const str = trs.objectStore('produtos');
                const req = str.add({idFornecedor: id, nome: nomeProduct, quantidade: 0, valor: 0});

                req.onsuccess = (e) =>{
                    res(req);
                }

                req.onerror = (e) =>{
                    rej(e);
                    alert("Erro ao cadastrar novo produto.");
                }

            }catch(e){
                console.log(e);
            }


            })
        }

        //delete products
        export async function deleteProduct(id){

            const db = await openDB();

            return new Promise ((res, rej)=>{

                

                    const trans = db.transaction(['produtos'], 'readwrite');
                    const str = trans.objectStore('produtos');
                    const req = str.delete(id);


                    req.onsuccess = () =>{
                        res("deletado com sucesso!");
                    }

                    req.onerror = () =>{
                        rej("erro ao deletar fornecedor!");
                        alert("erro ao deletar fornecedor!");
                        return

                    }

            })

        }


        // função de alteração de dados -> QUANTIDADE, VALOR E NOME
        export async function editProduct(id, option){
            
                
            const db = await openDB();

            return new Promise((res, rej) =>{

                const trans = db.transaction(['produtos'], 'readwrite');
                const str = trans.objectStore('produtos');
                var req = str.get(id);

               
                req.onsuccess = (e) =>{
                        const result = e.target.result;
                        // return console.log(id);
                        var reqPut;


                        if(option == 'nome'){

                            console.log("edit nome")
                            const nome = prompt("Digite um novo nome para o produto: ");
                            if(nome == null || nome.length == 0){
                                return
                            }
                            
                            result.nome = nome;
                            reqPut = str.put(result);

                        }else if(option == 'qt'){

                            const quantidade = prompt("Digite uma nova quantidade para o produto: ");
                            if(quantidade.length == 0){
                                return;
                            }
                            const qt = quantidade.replace(",",".");

                            if(quantidade == null){
                                return;
                            }

                            if(!isNaN(qt)){

                                if(qt == 0){
                                    result.quantidade = Number(qt);
                                }else if(Number.isInteger(Number(qt))){
                                    result.quantidade = Number(qt);
                                }else{
                                    alert("Erro, você precisa digitar um número inteiro.");
                                    return;
                                }

                                reqPut = str.put(result);

                            }else{
                                alert("Erro, você não digitou um numero");
                                return;
                            }

                        }else if(option == 'vl'){
                            const valor = prompt("Digite um novo valor para o produto: ");
                            if(valor.length == 0 ){
                                return
                            }
                            const valorCorrect = valor.replace(",", ".");
                            if(Number(valorCorrect)  || Number(valorCorrect) == 0){
                                if(valorCorrect == null){
                                    return
                                }
                                result.valor = parseFloat(valorCorrect);
                                reqPut = str.put(result);
                            }else{
                                alert("Erro, você não digitou um numero");
                                return;
                            }
                           
                        }else if( option == 'exit'){
                            // result.valor = 0;
                            result.quantidade = 0;
                            reqPut = str.put(result);
                        }


                        reqPut.onsuccess = (e) =>{
                            console.log(e.target.result);
                            res(true);
                            
                        }

                        reqPut.onerror = (e) =>{
                            rej(e);
                            alert("Erro ao alterar!");
                            return
                        }
 
                }

                req.onerror = (e) =>{
                    rej(e);
                    alert("Erro ao alterar!");
                    return
                }


            })
        }   


        //função de backup e importação de dados
        export async function getFornecedor() {
            const db = await openDB();

            return new Promise((res, rej) =>{

                const trFornecedor = db.transaction(['fornecedor'], 'readonly');
                const strFornecedor = trFornecedor.objectStore('fornecedor');
                const reqFornecedor = strFornecedor.getAll();

                reqFornecedor.onsuccess = (e) =>{
                    res(e.target.result);
                }

                reqFornecedor.onerror = (e) =>{
                    console.log(e);
                }


            });
        }

        export async function getProducts() {
            const db = await openDB();

            return new Promise((res, rej) =>{

                const trProduct = db.transaction(['produtos'], 'readonly');
                const strProduct = trProduct.objectStore('produtos');
                const reqProduct = strProduct.getAll();

                reqProduct.onsuccess = (e) =>{
                    res(e.target.result);
                }

                reqProduct.onerror = (e) =>{
                    console.log(e);
                }

            });
        }

        


        export async function importData(params, object) {
            const db = await openDB();

            return new Promise((res, rej) =>{

                var transaction = db.transaction([params], "readwrite");
                var objectStore = transaction.objectStore(params);

                var req =  objectStore.add(object);

                req.onsuccess = (e) =>{
                    res('ok');
                }

                req.onerror = (e) =>{
                    rej(e);
                }

            })
        }