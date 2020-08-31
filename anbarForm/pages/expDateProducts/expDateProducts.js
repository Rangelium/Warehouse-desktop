const { lang } = require("moment");

async function fillExpDateOverTable() {
	let data = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("dbo.exp_date_over", (err, res) => {
				if (err !== null) console.log(err);
				resolve(res.recordset);
			});
		});
	});
	console.log(data);
	$(".exp-date-over-table").remove();

	$(".exp-date-over-data").append(
		"<table class='exp-date-over-table'></table>"
	);
	$(".exp-date-over-table").append("<thead></thead>");
	$(".exp-date-over-table").append("<tbody></tbody>");

	$(".exp-date-over-table > thead").append(
		`<th>${languages["exp_date"]}:</th>`
	);
	$(".exp-date-over-table > thead").append(
		`<th>${languages["product_name"]}:</th>`
	);
	$(".exp-date-over-table > thead").append(`<th>${languages["barcode"]}:</th>`);
	$(".exp-date-over-table > thead").append(
		`<th>${languages["manufacturer"]}:</th>`
	);
	$(".exp-date-over-table > thead").append(
		`<th>${languages["quantity"]}:</th>`
	);
	$(".exp-date-over-table > thead").append(
		`<th>${languages["unit_price"]}:</th>`
	);
	$(".exp-date-over-table > thead").append(
		`<th>${languages["currency"]}:</th>`
	);
	$(".exp-date-over-table > thead").append(
		`<th>${languages["total_price"]}:</th>`
	);
	$(".exp-date-over-table > thead").append(`<th>VOEN:</th>`);

	data.forEach((el) => {
		let row = `<tr class="single-expired-row">`;

		row += `<td title="${moment(el.exp_date).format(
			"DD MMMM YYYY, h:mm:ss"
		)}">${moment(el.exp_date).format("DD MMMM YYYY")}</td>`;
		row += `<td>${el.product_title}</td>`;
		row += `<td>${el.barcode}</td>`;
		row += `<td>${el.manufacturer_title}</td>`;
		row += `<td>${el.quantity}</td>`;
		row += `<td>${el.price}</td>`;
		row += `<td>${el.currency_title}</td>`;
		row += `<td>${el.sum_price}</td>`;
		row += `<td>${el.product_voen}</td>`;
		row += "</tr>";
		$(".exp-date-over-table > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 12) {
		for (let i = 0; i < 12 - data.length; i++) {
			let row = "<tr style='height: 40px'>";

			for (let j = 0; j < 9; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".exp-date-over-table > tbody").append(row);
		}
	}

	$(".single-expired-row").click(function () {
		$(".single-expired-row").attr("data-isSelected", "False");
		$(this).attr("data-isSelected", "True");
	});
}

async function fillExpDateSoCloseTable() {
	let data = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("dbo.exp_date_soclose", (err, res) => {
				if (err !== null) console.log(err);
				resolve(res.recordset);
			});
		});
	});

	$(".exp-date-soclose-table").remove();

	$(".exp-date-soclose-data").append(
		"<table class='exp-date-soclose-table'></table>"
	);
	$(".exp-date-soclose-table").append("<thead></thead>");
	$(".exp-date-soclose-table").append("<tbody></tbody>");

	$(".exp-date-soclose-table > thead").append(
		`<th>${languages["exp_date"]}:</th>`
	);
	$(".exp-date-soclose-table > thead").append(
		`<th>${languages["product_name"]}:</th>`
	);
	$(".exp-date-soclose-table > thead").append(
		`<th>${languages["barcode"]}:</th>`
	);
	$(".exp-date-soclose-table > thead").append(
		`<th>${languages["manufacturer"]}:</th>`
	);
	$(".exp-date-soclose-table > thead").append(
		`<th>${languages["quantity"]}:</th>`
	);
	$(".exp-date-soclose-table > thead").append(
		`<th>${languages["unit_price"]}:</th>`
	);
	$(".exp-date-soclose-table > thead").append(
		`<th>${languages["currency"]}:</th>`
	);
	$(".exp-date-soclose-table > thead").append(
		`<th>${languages["total_price"]}:</th>`
	);
	$(".exp-date-soclose-table > thead").append(`<th>VOEN:</th>`);

	data.forEach((el) => {
		let row = `<tr>`;

		row += `<td title="${moment(el.exp_date).format(
			"DD MMMM YYYY, h:mm:ss"
		)}">${moment(el.exp_date).format("DD MMMM YYYY")}</td>`;
		row += `<td>${el.product_title}</td>`;
		row += `<td>${el.barcode}</td>`;
		row += `<td>${el.manufacturer_title}</td>`;
		row += `<td>${el.quantity}</td>`;
		row += `<td>${el.price}</td>`;
		row += `<td>${el.currency_title}</td>`;
		row += `<td>${el.sum_price}</td>`;
		row += `<td>${el.product_voen}</td>`;
		row += "</tr>";
		$(".exp-date-soclose-table > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 12) {
		for (let i = 0; i < 12 - data.length; i++) {
			let row = "<tr style='height: 40px'>";

			for (let j = 0; j < 9; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".exp-date-soclose-table > tbody").append(row);
		}
	}
}

fillExpDateOverTable();
fillExpDateSoCloseTable();
