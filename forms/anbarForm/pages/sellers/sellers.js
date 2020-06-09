poolConnect.then((pool) => {
	pool.request().execute("dbo.product_sellers_select", (err, res) => {
    // console.log(res.recordset);
		// generateTable($("#sellersTable")[0], res.recordset);
		// generateTableHead($("#sellersTable")[0], ["Title", "Firstname", "Lastname", "Patronymic", "Active", "P Address", "Phone Number"]);
		// $("td").addClass("sellersTableElement");
		// $("th").addClass("sellersTableElement");
		// $("tbody").wrap("<div class='tbody' style='height:100%; width: calc(700% + 14px); overflow-y: scroll'></div>");

		data = []
		for(let i of res.recordset){
			data.push(i);
		}
		$(".sellersProductTable").remove();
					
// let head = ["Title", "Firstname", "Lastname", "Patronymic", "Active", "P Address", "Phone Number"];
		$(".sellers-table-data").append("<table class='sellersProductTable'></table>");
		$(".sellersProductTable").append("<thead></thead>");
		$(".sellersProductTable").append("<tbody></tbody>");

		$(".sellersProductTable > thead").append(`<th>Title:</th>`);
		$(".sellersProductTable > thead").append(`<th>Firstname:</th>`);
		$(".sellersProductTable > thead").append(`<th>Lastname:</th>`);
		$(".sellersProductTable > thead").append(`<th>Patronymic:</th>`);
		$(".sellersProductTable > thead").append(`<th>Active:</th>`);
		$(".sellersProductTable > thead").append(`<th>P Address:</th>`);
		$(".sellersProductTable > thead").append(`<th>Phone Number:</th>`);

		data.forEach((el) => {
			let row = "<tr>";
			console.log(el.title);
			row += `<td>${el.title}</td>`;
			row += `<td>${el.firstname}</td>`;
			row += `<td>${el.lastname}</td>`;
			row += `<td>${el.patronymic}</td>`;
			row += `<td>${el.active}</td>`;
			row += `<td>${el.p_address}</td>`;
			row += `<td>${el.phonenumber}</td>`;

			row += "</tr>";
			$(".sellersProductTable > tbody").append(row);
		});
		$(".sellersProductInfo").css("opacity", "1");
		$(".sellersProductInfo").css("pointer-events", "unset");
	});
});
