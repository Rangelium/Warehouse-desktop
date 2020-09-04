const {dialog} = require("electron").remote

var format   = "PDF"
var dateFrom = "2020-01-01"
var dateTo   = "2020-10-10"
var url = (format) => `http://172.16.3.42:88/Reports/Report.php?ReportName=reportBuy&Format=${format}&data[dateto]=${dateTo}&data[datefrom]=${dateFrom}`;


$("#submitReport").click(() => {
  // dateFrom = moment($("#dateFrom").val()).format("YYYY-MM-DD");
  // dateTo   = moment($("#dateTo").val()).format("YYYY-MM-DD");
  $("#reportView").empty();
  let webview = document.createElement("webview");
  webview.className = "reportWebView";
  $(webview).attr("src", url("PDF"));
  console.log(url());
  $("#reportView").append(webview);
})

let options = {properties: ['openDirectory']}

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
  let dir = $("#selectFolder").attr("title");
  if(dir == undefined){
    alert("No");
    return;
  }

  ipcRenderer.send("downloadReport", {
    url: url(format),
    properties: {directory: dir}
  });

});

$("#dateFrom").change(function(){
  dateFrom = $(this).val();
})

$("#dateTo").change(function(){
  dateTo = $(this).val();
})

$("#selectFormat").change(function(){
  format = $(this).val();
  console.log(url());
})