import { addProduct, viewProductsF, deleteProduct, editProduct } from "../../../connection/db.js";




//pegando infos passadas pela url
var captName  = new URLSearchParams(window.location.search).get('name');
var Id = new URLSearchParams(window.location.search).get('id');

document.getElementById("my-header").innerHTML = `<button id="btn-header" onclick="window.location.href = '../home/home.html'">${captName}</button>`


var navigation = document.getElementById('selectaction');
var animationNavigation = true;

var navigationProducts = document.getElementById('products');

var viewPDF = document.getElementById("create-pdf");
var viewADD = document.getElementById("add-product");

var spinner = document.getElementById("load").style;


var data = [];

var  results = [];

function handleSpinner(Boolean){
    if(Boolean == true){
        spinner.display = 'flex';
    }else{
        spinner.display = 'none';
    }
}



function handleScreens(Boolean){
    if(Boolean == true){
        
        if(data.length != 0){
            document.getElementById("navigation").style.display = 'flex';
         }

        viewADD.style.display = 'flex';
        viewPDF.style.display = 'none';

        navigation.style.width = '100%';
        navigation.style.left = '0';

        setTimeout(() =>{
            navigation.style.left = '0';
            navigation.style.width = '50%';
        }, 300);

        animationNavigation = Boolean;

        document.getElementById("requests").style.backgroundColor = '#fff';
        document.getElementById("products").style.backgroundColor = '#f1f1f1';

        

    }else{
        viewADD.style.display = 'none';
        viewPDF.style.display = 'flex';
        
        navigation.style.width = '100%';

        setTimeout(() =>{
            navigation.style.left = 'calc(100% - 50%)';
            navigation.style.width = '50%';
        }, 300);

        animationNavigation = Boolean;
 

        document.getElementById("requests").style.backgroundColor = '#f1f1f1';
        document.getElementById("products").style.backgroundColor = '#fff';
    

        if(data.length != 0){
            document.getElementById("navigation").style.display = 'flex';
        }

    }

}





//lidando com gestos em celulares

window.document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchEndX = 0;

    document.body.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.body.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
          
            viewRequests();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchEndX = 0;

    document.body.addEventListener('touchstart', (e) => {
        touchEndX = e.changedTouches[0].screenX;
    });

    document.body.addEventListener('touchend', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            viewProduct();
        }
    }
});




//funções de visualização de produtos e pedidos


window.viewProduct = async function (){

    window.document.getElementById("search").value = "";
        handleSpinner(true);
        data = await viewProductsF(Id, 15, true);
        handleScreens(true);

        if(data.length == 0 ){
            handleSpinner(false);
            document.getElementById("navigation").style.display = 'none';
            viewADD.style.display = 'flex';
            viewPDF.style.display = 'none';
            document.getElementById("itens").innerHTML = `<div id="card-header"><p>Este Fornecedor não possui produtos cadastrados. Cadastre um produto apertando em +</p>`;
            return
        }

        data.sort((a, b) => a.nome.localeCompare(b.nome));


            const ViewList  = data.map(i =>{

                

                const card = `
                <div id="card">
   
                    <div id="card-header">
                        
        
                       <button id="headerTrash" onclick="deleteProducts(${i.id})" style="background-image: url('../../../icons/trash-red.png');background-size: 40px;">
                        </button>
                        <button id="headerEdit" onclick="updateProducts(${i.id}, 'nome')" style="background-image: url('../../../icons/edit.png');background-size: 50px;">
                        </button>
        
                       
        
                    </div>
   
                        <P style="font-weight: bold;">${i.nome} </P>
            
                        <div id="card-actions">
                            <button onclick="updateProducts(${i.id}, 'qt')" style="background-image: url('../../../icons/plus.png'); background-color: #349d28; border-color: #245e1b;">
                                
                            </button>
                            <button onclick="updateProducts(${i.id}, 'vl')" style="background-image: url('../../../icons/money.png');background-color: transparent; border-color: #14C005;">
            
                            </button>
                        </div>
            
                        <div id="card-actions">
                            <p>quantidade: ${i.quantidade}</p>
                            <p>valor: R$ ${i.valor}</p>
                        </div>
   
                </div>
             
               `;

              

                return card;
   
           });
   
           document.getElementById("itens").innerHTML = ViewList.join("");
           results = data;
        
           const marker = await viewProductsF(Id, 15, false);

           if(marker.length == 0){
                document.getElementById("marker").style.display = 'none';
           }else{
                document.getElementById("marker").style.display = 'flex';
           }

            handleSpinner(false);
           console.log(data);
        
        ReloadCalc();
       

}

await viewProduct();

var calc = 0;

function ReloadCalc() {
  calc = 0;
  for (var i = 0; i < data.length; i++) {
    calc += data[i].quantidade * data[i].valor;
  }
} 


window.viewRequests = async function (){

    window.document.getElementById("search").value = "";

     

    handleSpinner(true);
    if(animationNavigation != false){
        handleScreens(false);
    }
    
    data = await viewProductsF(Id, 15, false);

    if(data.length == 0 ){
        document.getElementById("create-pdf").style.display = "none";
    }else{
        document.getElementById('create-pdf').style.display = "flex";
    }
   
  const ViewList  = data.map(i =>{


                const card = `
                <div id="card">
   
                    <div id="card-header">
                        
                         <button onclick="updateProducts(${i.id}, 'exit')" id="headerClose" style="background-image: url('../../../icons/close.png'); background-size: 60px;">
        
                        </button>
        
                    </div>
   
                        <P style="font-weight: bold;">${i.nome} </P>
            
                        <div id="card-actions">
                            <button onclick="updateProducts(${i.id}, 'qt')" style="background-image: url('../../../icons/plus.png'); background-color: #349d28; border-color: #245e1b;">
                                
                            </button>
                            <button onclick="updateProducts(${i.id}, 'vl')" style="background-image: url('../../../icons/money.png');background-color: transparent; border-color: #14C005;">
            
                            </button>
                        </div>
            
                        <div id="card-actions">
                            <p>quantidade: ${i.quantidade}</p>
                            <p>valor: R$ ${i.valor}</p>
                        </div>
   
                </div>
                
               `;

              

                return card;
   
           });
           results = data;
           ReloadCalc();
           
            document.getElementById("itens").innerHTML = ViewList.join("");
            document.getElementById("buy").innerHTML  = `Buy: R$ ${calc.toFixed(2)}`;


            handleSpinner(false);
    
    
}


//função de adicionar produto

window.addProducts = async function (){
    try{
       
        console.log('add')
        await addProduct(Id);
        await viewProduct();
        

    }catch(e){
        alert("Erro ao cadastrar novo produto!");

    }
}

//funçõa de deletar produto

window.deleteProducts = async function(id){
    try{

        console.log('delete');
        const condition = confirm("Tem certeza que deseja deletar esse produto?");

        if(condition){
            if(await deleteProduct(id)){
                alert("deletado com sucesso!");
            }

            await viewProduct();
        }
        
        ReloadCalc();

    }catch (e){
        alert("Erro ao deletar produto!");
    }
}

//função alterar produtos
window.updateProducts = async function(id, option){
    try{

        if(await editProduct(id, option)){
            if(animationNavigation== true){
                await viewProduct();
            }else{
                await viewRequests();
            }
            
        }

        
     

    }catch (e){
        console.log(e);
        alert("Erro ao alterar produto!");
    }
}

//função limpar requests
window.clearProducts = async function(){
    try{

        const condition = confirm("Tem certeza que deseja limpar seus pedidos por completo?");

        if(condition){
            for(var i = 0; i < data.length; i++){

                await editProduct(data[i].id, 'exit');

    
            }
    
            await viewRequests();
        }

       ReloadCalc();

    }catch(e){
        alert("Erro ao limpar area dos pedidos.")
    }
}


//função filtro de produtos
window.filterResult = function(){

    const value = window.document.getElementById("search").value.toLowerCase();
    // return console.log(value);
   
    const filterData = results.filter( i=> i.nome.toLowerCase().includes(value));
    console.log(filterData);
    window.document.getElementById("itens").innerHTML  = '';
    


    if(filterData.length > 0){

            if(animationNavigation == true){
                
            

            const result = filterData.map(i =>{
                return`
                <div id="card">
   
                    <div id="card-header">
                        
        
                       <button id="headerTrash" onclick="deleteProducts(${i.id})" style="background-image: url('../../../icons/trash-red.png');background-size: 40px;">
                        </button>
                        <button id="headerEdit" onclick="updateProducts(${i.id}, 'nome')" style="background-image: url('../../../icons/edit.png');background-size: 50px;">
                        </button>
        
                       
        
                    </div>
   
                        <P style="font-weight: bold;">${i.nome} </P>
            
                        <div id="card-actions">
                            <button onclick="updateProducts(${i.id}, 'qt')" style="background-image: url('../../../icons/plus.png'); background-color: #349d28; border-color: #245e1b;">
                                
                            </button>
                            <button onclick="updateProducts(${i.id}, 'vl')" style="background-image: url('../../../icons/money.png');background-color: transparent; border-color: #14C005;">
            
                            </button>
                        </div>
            
                        <div id="card-actions">
                            <p>quantidade: ${i.quantidade}</p>
                            <p>valor: R$ ${i.valor}</p>
                        </div>
   
                </div>
                
               `
            })
            console.log("products");
            window.document.getElementById("itens").innerHTML   = result.join("");

        }else{
            const result = filterData.map(i =>{
                return`
                <div id="card">
   
                    <div id="card-header">
                        
          <button onclick="updateProducts(${i.id}, 'exit')" id="headerClose" style="background-image: url('../../../icons/close.png'); background-size: 60px;">
        
                        </button>
        
                       
        
                    </div>
   
                        <P style="font-weight: bold;">${i.nome} </P>
            
                        <div id="card-actions">
                            <button onclick="updateProducts(${i.id}, 'qt')" style="background-image: url('../../../icons/plus.png'); background-color: #349d28; border-color: #245e1b;">
                                
                            </button>
                            <button onclick="updateProducts(${i.id}, 'vl')" style="background-image: url('../../../icons/money.png');background-color: transparent; border-color: #14C005;">
            
                            </button>
                        </div>
            
                        <div id="card-actions">
                            <p>quantidade: ${i.quantidade}</p>
                            <p>valor: R$ ${i.valor}</p>
                        </div>
   
                </div>
                
               `
            })
            console.log("products");
            window.document.getElementById("itens").innerHTML   = result.join("");
        }

        
    }

}

//função criar pdf


const { jsPDF } = window.jspdf;



window.gereatePDF = async function(){
    // const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    var date = new Date()
    doc.text(`Data: ${date.toLocaleDateString()}`,20,10);
    doc.text(`FORNECEDOR: ${captName}`, 20, 20);
    const conferente = prompt("digite seu nome: ");
    doc.text(`Nome do Conferente: ${conferente}`, 20, 35);
    const head = [['Nome', 'Quant.', 'Valor Un. R$', 'Valor Total']];

    const results = [];

    for(var i = 0; i< data.length; i++){
        const dado = [data[i].nome, data[i].quantidade, `R$ ${data[i].valor.toFixed(2)}`, `R$ ${(data[i].valor * data[i].quantidade).toFixed(2)}`];
        results.push(dado);
    }

    results.push(['Valor Total do Pedido:','','', ` R$ ${calc.toFixed(2)}`])

    doc.autoTable({
        head: head,
        body: results,
        startY: 40,
        theme: 'grid',
        headStyles: {fillColor: [100,100,255]},
        alternateRowStyles: { fillColor:[240, 240, 240]},
        margin:{ top: 20},
        didParseCell: function(results){
            if(results.row.index === results.table.body.length -1){
                results.cell.styles.fontSize = 15;
                results.cell.styles.fontStyle = 'bold';
            }
        }
    });


    doc.save(`pedido ${captName}.pdf`);
}

function copyAT(text){
    if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(text)
        .then(() =>{
            alert("Texto copiado");
        })
        .catch(e =>{
            console.log('erro ao copiar')
        })
    }else {
        // Método alternativo para navegadores antigos
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // Garante que o campo textarea seja invisível
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert("Texto copiado para a área de transferência!");
        } catch (err) {
            console.error("Erro ao copiar para a área de transferência: ", err);
        }
        document.body.removeChild(textArea);
    }

        
}


window.copy = function(){

    console.log("copy");
    let un = ''
    let text = 'Pedidos para a Semana: \n \n';

    for(var i =0; i < data.length; i++){
        if(data[i].valor == 1){
            un = 'Fardo/Caixa';
        }else{
            un= 'Unidade';
        }
        text += `*${data[i].nome}:*  ${data[i].quantidade}  -- ${un} \n`;

    }

    text += '\n \n';
    text += 'Obrigado, tenha uma ótima semana!!';

    copyAT(text);
    



}
