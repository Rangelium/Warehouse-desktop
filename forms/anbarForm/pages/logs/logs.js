// Please try to do all page related things in page related js files
// like this logs.js


poolConnect.then((pool) => {
	pool.request().execute("dbo.exec_all_logs", (err, res) => {
		generateTable($("#logsTable")[0], res.recordset);
		generateTableHead($("#logsTable")[0], ["Operation", "Action", "Date", "Username"]);
		$("tbody").wrap("<div class='tbody' style='height:100%; width: calc(400% + 10px); overflow-y: scroll'></div>")
	});
});
