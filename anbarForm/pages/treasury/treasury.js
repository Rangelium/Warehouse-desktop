var exchangeSelectedId = -1;
poolConnect.then((pool) => {
	pool.request().execute("anbar.currency_select", (err, res) => {
		let data = [];
		for (let i of res.recordset) {
			data.push(i);
		}
		console.log(res);
		for (let result of data) {
			$("#currencyId").append(
				$("<option>", { value: result["id"], text: result["title"] })
			);
		}
	});
});

var now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
$("#time").val(now.toISOString().slice(0, 16));

function fillTable() {
	poolConnect.then((pool) => {
		pool.request().execute("anbar.exchange_rate_select", (err, res) => {
			data = [];
			console.log(res);
			for (let i of res.recordset) {
				data.push(i);
			}
			$(".exchangeProductTable").remove();

			$(".exchange-table-data").append(
				"<table class='exchangeProductTable'></table>"
			);
			$(".exchangeProductTable").append("<thead></thead>");
			$(".exchangeProductTable").append("<tbody></tbody>");

			$(".exchangeProductTable > thead").append(
				`<th>${languages["title"]}:</th>`
			);
			$(".exchangeProductTable > thead").append(
				`<th>${languages["date"]}:</th>`
			);
			$(".exchangeProductTable > thead").append(
				`<th>${languages["value"]}:</th>`
			);

			data.forEach((el) => {
				let row = `<tr>`;
				row += `<td style="display:none" id="exchangeId">${el.id}</td>`;
				row += `<td>${el.title}</td>`;
				row += `<td title="${moment(el.time).format(
					"Da MMMM YYYY, h:mm:ss"
				)}">${moment(el.time).format("Da MMMM YYYY")}</td>`;
				row += `<td>${el.value}</td>`;
				row += "</tr>";
				$(".exchangeProductTable > tbody").append(row);
			});
			$(".exchangeProductInfo").css("opacity", "1");
			$(".exchangeProductInfo").css("pointer-events", "unset");
			let tr = document.querySelectorAll("tbody tr");
			tr.forEach((el) => {
				el.addEventListener("click", () => {
					tr.forEach((trel) => {
						trel.classList.remove("selected");
					});
					el.classList.toggle("selected");
					exchangeSelectedId = el.firstChild.textContent;
				});
			});
		});
	});
}
fillTable();

$(".exchangeInputButton").on("click", () => {
	let currencyId = $("#currencyId").val();
	let value = $("#value").val();
	let time = new Date($("#time").val());
	console.log(value);
	console.log(time);
	if (currencyId == "" || value.length == 0 || time.length == 0) {
		alert("All fields must be filled");
		return;
	}

	poolConnect.then((pool) => {
		pool
			.request()
			.input("currency_id", mssql.Int, currencyId)
			.input("value", mssql.Float, value)
			.input("time", mssql.DateTime, time)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.exchange_rate_insert", (err, res) => {
				console.log(err);
				$("input").val("");
				fillTable();
			});
	});
});

$(".exchangeDeleteButton").on("click", () => {
	if (exchangeSelectedId < 0) {
		alert("Row must be selected");
		return;
	}
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", mssql.Int, exchangeSelectedId)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.exchange_rate_delete", (err, res) => {
				fillTable();
			});
	});
});
