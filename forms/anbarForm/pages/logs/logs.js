let logsTable = document.getElementById("#logsTable")
ipcRenderer.on("logsTableReply", (event, arg) => {
  generateTable(logsTable, arg);
  generateTableHead(logsTable, ['Operation', 'Action', "Date", "Username"])
  cashTable = logsTable;
})
ipcRenderer.send("logsTable");
