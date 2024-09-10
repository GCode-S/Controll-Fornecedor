import { getProducts ,getFornecedor, importData } from "../../../connection/db.js";

window.backupOn = async function(){

    try{

        const storeFornecedor = await getFornecedor();

        const storeProduct =  await getProducts();

        var dataToBackup = {fornecedores: [], produtos: []};

        dataToBackup.fornecedores = storeFornecedor;
        dataToBackup.produtos = storeProduct;

        var jsonData = JSON.stringify(dataToBackup);
        var blob = new Blob([jsonData], { type: "application/json" });
        var a = document.createElement("a");
        var url = URL.createObjectURL(blob);
        a.href = url;
        a.download = "backup.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    }catch{
        alert("erro ao gerar dados do backup.");
    }

}

window.importDatas = async function() {

    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
  
    if (file) {
      var reader = new FileReader();
  
        reader.onload = async function (e) {

        return new Promise((res, rej) =>{
          try {

            var importedData = JSON.parse(e.target.result);

            
            importedData.produtos.forEach(async function (produtos) {
              await importData('produtos', produtos);
            });

            importedData.fornecedores.forEach(async function (produtos) {
              await importData('fornecedor', produtos);
            });


            alert("Dados importados com sucesso!");
            

          } catch (error) {
            console.error("Erro ao importar dados:", error);
            alert("Erro ao importar dados. Verifique o formato do arquivo.");
          }

          res(importedData);
        })
        
      };
  
     await reader.readAsText(file);
      // window.location.href = '../home/home.html';
    } else {
      alert("Selecione um arquivo para importar.");
    }
}