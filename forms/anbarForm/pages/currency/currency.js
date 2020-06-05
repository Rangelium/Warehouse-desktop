console.log("currency.js");
poolConnect.then((pool) => {
	pool.request().execute("dbo.currency_select", (err, res) => {
		generateTable($("#currencyTable")[0], res.recordset);
		generateTableHead($("#currencyTable")[0], [
			"Valyutanın tam adı",
			"Valyutanın qısa adı",
		]);
		$("td").addClass("currencyTableElement");
		$("th").addClass("currencyTableElement");
		// $("tbody").wrap("<div class='tbody' style='height:100%; width: calc(200% + 12px); overflow-y: scroll'></div>")
	});
});
