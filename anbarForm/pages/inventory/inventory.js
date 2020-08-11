console.log("inventory.js");

poolConnect.then((pool) => {
  pool.request()
    .execute("dbo.products_return", (err, res) => {
      let data = []
      for(let i of res.recordset){
        data.push(i);
      }
      console.log(res);
      for(let result of data){
        $("#productId").append($("<option>", {value: result["product_id"], text: result["title"]}));
      }
      createProductInput();
    })
  })
    
function productDropdown(){
  return (($("#productId").first()).clone());
}

function createProductInput(){
  let p = $(".productInput").first().clone();
  p.css("display", "flex");
  $(".inventoryInputs").append(p);
}

poolConnect.then((pool) => {
  pool.request()
      .execute("dbo.products_return", (err, res) => {
        let data = []
        for(let i of res.recordset){
          data.push(i);
        }
        for(let result of data){
          $("#productId").append($("<option>", {value: result["product_id"], text: result["title"]}));
        }
      })
})


$("#inventoryStart").on("click", () =>{
  // $("#inventoryStart").fadeOut(100);
  poolConnect.then((pool) => {
    pool.request()
        .execute("inventory.is_finished", (err, res) => {
          if(res.recordset[0].value == "1"){
            poolConnect.then((npool) => {
              npool.request()
                  .execute("inventory.start", (err, res) => {
                    
                  })
            })
          }
          else{
            poolConnect.then((npool) => {
              npool.request()
                  .execute("inventory.cont", (err, res) => {
                    
                  })
            })
          }
        })
  })
})
