var {dialog} = require("electron").remote

var format     = "PDF"
var dateFrom   = null
var dateTo     = null
var reportType = "reportBuy"
var table_name = null;
var reportUrl = (format) => `http://172.16.3.42:88/Reports/Report.php?ReportName=${reportType}&Format=${format}&data[dateto]=${dateTo}&data[datefrom]=${dateFrom}`;
var reportInventoryUrl = (format) => `http://172.16.3.42:88/Reports/Report.php?ReportName=${reportType}&Format=${format}&data[table_name]=${table_name}`;

poolConnect.then((pool) => {
  pool.request()
      .execute("inventory.tables_list", (err, res) => {
        let data = [];
        for (let i of res.recordset) {
          data.push(i);
        }
        for(let result of data){
          $("#tableOptions").append(
            $("<option>",{value: result['table_name'], text: moment(result['creation_date']).format("DD MMMM YYYY")})
          );
        }
        
      })
})


var options = {properties: ['openDirectory']}

$("#selectFolder").click(() => {
  (async function(){
    let dir = await dialog.showOpenDialog(options);
    let dirs = dir.filePaths[0].split("\\");
    let dirPath = dirs[dirs.length - 1];
    $("#selectFolder").text(dirPath);
    $("#selectFolder").attr("title", dir.filePaths[0]);
  })();
})

$("#downloadReport").click(() => {
  // let dir = $("#selectFolder").attr("title");
  (async function(){
    let dir = await dialog.showOpenDialog(options);
    // let dirs = dir.filePaths[0].split("\\");
    // let dirPath = dirs[dirs.length - 1];
    if(dir == undefined || dir == null){
      alert("Please select folder");
      return;
    }
    ipcRenderer.send("downloadReport", {
      url: reportUrl(format),
      properties: {directory: dir.filePaths[0]}
    });
  })();


});

$("#selectReport").change(function(){
  reportType = $(this).val();
  if(reportType == 'Inventory'){
    $(".reportLabel[data-id='dateInput']").fadeOut(1);
    $("label[for='selectTable']").fadeIn(10);
    // $("#selectTable").fadeIn(10);
  }
  else{
    $("label[for='selectTable']").fadeOut(1);
    $(".reportLabel[data-id='dateInput']").fadeIn(10);
  }
  if(dateTo == null || dateFrom == null) return;
  $("#reportView").empty();
  let webview = document.createElement("webview");
  webview.className = "reportWebView";
  $(webview).attr("src", reportUrl("PDF"));
  $("#reportView").append(webview);
})

$("#selectTable").change(function(){
  table_name = $(this).val();
  $("#reportView").empty();
  let webview = document.createElement("webview");
  webview.className = "reportWebView";
  $(webview).attr("src", reportInventoryUrl("PDF"));
  $("#reportView").append(webview);
})

$("#dateFrom").change(function(){
  dateFrom = $(this).val();
  if(dateTo == null) return;
  $("#reportView").empty();
  let webview = document.createElement("webview");
  webview.className = "reportWebView";
  $(webview).attr("src", reportUrl("PDF"));
  $("#reportView").append(webview);
})

$("#dateTo").change(function(){
  dateTo = $(this).val();
  if(dateFrom == null) return;
  $("#reportView").empty();
  let webview = document.createElement("webview");
  webview.className = "reportWebView";
  $(webview).attr("src", reportUrl("PDF"));
  console.log(reportUrl());
  $("#reportView").append(webview);
})

$("#selectFormat").change(function(){
  format = $(this).val();
  console.log(reportUrl());
})