// Please try to do all page related things in page related js files
// like this logs.js

// Generate Table Function
function generateTableHead(table, columnNames) {
	let thead = table.createTHead();
	let headRow = thead.insertRow();
	for (let name in columnNames) {
		let th = document.createElement("th");
		let text = document.createTextNode(columnNames[name]);
		th.appendChild(text);
		headRow.appendChild(th);
	}
}

function generateTable(table, data) {
	for (let element of data) {
		let row = table.insertRow();
		for (key in element) {
			let cell = row.insertCell();
			let text = document.createTextNode(element[key]);
			cell.appendChild(text);
		}
	}
}

poolConnect.then((pool) => {
	pool.request().execute("dbo.exec_all_logs", (err, res) => {
		generateTable($("#logsTable")[0], res.recordset);
		generateTableHead($("#logsTable")[0], ["Operation", "Action", "Date", "Username"]);
	});
});
