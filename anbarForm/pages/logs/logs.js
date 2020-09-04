// Please try to do all page related things in page related js files
// like this logs.js

// poolConnect.then((pool) => {
// 	pool.request().execute("anbar.exec_all_logs", (err, res) => {
// 		generateTable($("#logsTable")[0], res.recordset);
// 		generateTableHead($("#logsTable")[0], ["Operation", "Action", "Date", "Username"]);
// 		$("td").addClass("logsTableElement");
// 		$("th").addClass("logsTableElement");
// 		$("tbody").wrap(
// 			"<div class='tbody' style='height: 100%;width: calc(400% + 10px); overflow-y: scroll'></div>"
// 		);
// 	});
// });
poolConnect.then((pool) => {
	pool.request().execute("anbar.exec_all_logs", (err, res) => {
		data = [];
		for (let i of res.recordset) {
			data.push(i);
		}
		$(".logsProductTable").remove();

		// let head = ["Title", "Firstname", "Lastname", "Patronymic", "Active", "P Address", "Phone Number"];
		$(".logs-table-data").append("<table class='logsProductTable'></table>");
		$(".logsProductTable").append("<thead></thead>");
		$(".logsProductTable").append("<tbody></tbody>");

		$(".logsProductTable > thead").append(`<th>${languages["data"]}</th>`);
		$(".logsProductTable > thead").append(`<th>${languages["action"]}</th>`);
		$(".logsProductTable > thead").append(`<th>${languages["date"]}</th>`);
		$(".logsProductTable > thead").append(`<th>${languages["confirmed"]}</th>`);

		data.forEach((el) => {
			let row = "<tr>";
			row += `<td>${el.operation}</td>`;
			row += `<td>${el.usedrow}</td>`;
			row += `<td title="${moment(el.wTime).format(
				"Da MMMM YYYY, h:mm:ss"
			)}">${moment(el.wTime).format("Da MMMM YYYY")}</td>`;
			row += `<td>${el.username}</td>`;

			row += "</tr>";
			$(".logsProductTable > tbody").append(row);
		});
		$(".logsProductInfo").css("opacity", "1");
		$(".logsProductInfo").css("pointer-events", "unset");
	});
});
