poolConnect.then((pool) => {
	pool.request().execute("dbo.exec_all_logs", (err, res) => {
		generateTable($("#logsTable")[0], res.recordset);
		generateTableHead($("#logsTable")[0], ["Operation", "Action", "Date", "Username"]);
	});
});
