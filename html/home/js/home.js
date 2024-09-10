
import { viewFornecedor, deleteFornecedor, addNewFornecedor, updateFornecedor } from "../../../connection/db.js";


//efeitos carregar
var spinner = document.getElementById('load');



//movimentação de paginas
window.movePag = function(name, num, nameF){
    if(nameF.length > 0){
        window.location.href = `../${name}/${name}.html?id=${num}&name=${nameF}`;
    }else{
        window.location.href = `../${name}/${name}.html`;
    }
   
}


//view fornecedors
var views = [];
async function viewProps(){
    spinner.style.display = 'flex';
    try{

        
        views = await viewFornecedor ();

        console.log(views);
        
        const elementsView = views.map(view => {
            return `
            <div id="component">
                <button id="button-name" onclick="movePag('list', ${view.id}, '${view.nome}')">
                    ${view.nome}
                </button>
                <div id="component-intern">
                    <button onclick="put(${view.id})" style="background-image: url('../../../icons/edit.png');"></button>
                    <button onclick="deleted(${view.id})" style="background-image: url('../../../icons/trash.png'); background-color: red;"></button>
                </div>
                </div>`;})

        document.getElementById("divElements").innerHTML = elementsView.join("");

        spinner.style.display = 'none';

    }catch (e){
        alert("Erro ao exibir Dados");
    }

  
}

viewProps();    


// ações no DB

window.createFornecer = async function(){

    try{
        
        await addNewFornecedor();
        await viewProps();

    }catch(e){
        alert("Erro ao Criar fornecedor!");
        console.log(e);
    }
}


//aleterar

window.put = async function(id){
    try{
        await updateFornecedor(id);
        await viewProps();
    }catch(e){
        alert("Ops, erro ao alterar dados.");
    }
}

//delete fornecedor

window.deleted = async function(id){
    try{

        await deleteFornecedor(id);
        await viewProps();

    }catch (e){
        alert("Erro ao deletar");
    }
}



// deleteDB()

async function deleteDB(){
    const deleted = indexedDB.deleteDatabase("productControl");

    deleted.onerror = (e) =>{
        console.log(e);
    }

    deleted.onsuccess = (e) =>{
        console.log("deletado")
    }
}

window.filterResult = function(){

    const value = window.document.getElementById("search").value.toLowerCase();
    // return console.log(value);
   
    const filterData = views.filter( i=> i.nome.toLowerCase().includes(value));
    // return console.log(filterData);
    window.document.getElementById("divElements").innerHTML  = '';

    if(filterData.length > 0){
        const result = filterData.map(view =>{
            return `
                 <div id="component">
                <button id="button-name" onclick="movePag('list', ${view.id}, '${view.nome}')">
                    ${view.nome}
                </button>
                <div id="component-intern">
                    <button onclick="put(${view.id})" style="background-image: url('../../../icons/edit.png');"></button>
                    <button onclick="deleted(${view.id})" style="background-image: url('../../../icons/trash.png'); background-color: red;"></button>
                </div>
                </div>
            `;
        })

        document.getElementById("divElements").innerHTML = result.join("");
    }

}