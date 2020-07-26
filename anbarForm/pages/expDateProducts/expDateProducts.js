async function fillExpDateOverTable() {
	let data = await new Promise((resolve) => {
		poolConnect.then((pool) => {
			pool.request().execute("dbo.exp_date_over", (err, res) => {
				if (err !== null) console.log(err);
				resolve(res.recordset);
			});
		});
	});

	$(".exp-date-over-table").remove();

	$(".exp-date-over-data").append("<table class='exp-date-over-table'></table>");
	$(".exp-date-over-table").append("<thead></thead>");
	$(".exp-date-over-table").append("<tbody></tbody>");

	$(".exp-date-over-table > thead").append(`<th>Kek:</th>`);
	$(".exp-date-over-table > thead").append(`<th>Lol:</th>`);
	$(".exp-date-over-table > thead").append(`<th>KekLol:</th>`);

	data.forEach((el) => {
		let row = `<tr>`;

		row += `<td>${el.id}</td>`;
		row += `<td>${el.id}</td>`;
		row += `<td>${el.id}</td>`;

		row += "</tr>";
		$(".exp-date-over-table > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 12) {
		for (let i = 0; i < 12 - data.length; i++) {
			let row = "<tr style='height: 40px'>";

			for (let j = 0; j < 3; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".exp-date-over-table > tbody").append(row);
		}
	}
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

	$(".exp-date-soclose-data").append("<table class='exp-date-soclose-table'></table>");
	$(".exp-date-soclose-table").append("<thead></thead>");
	$(".exp-date-soclose-table").append("<tbody></tbody>");

	$(".exp-date-soclose-table > thead").append(`<th>Kek:</th>`);
	$(".exp-date-soclose-table > thead").append(`<th>Lol:</th>`);
	$(".exp-date-soclose-table > thead").append(`<th>KekLol:</th>`);

	data.forEach((el) => {
		let row = `<tr>`;

		row += `<td>${el.id}</td>`;
		row += `<td>${el.id}</td>`;
		row += `<td>${el.id}</td>`;

		row += "</tr>";
		$(".exp-date-soclose-table > tbody").append(row);
	});

	// Fill empty tables
	if (data.length < 12) {
		for (let i = 0; i < 12 - data.length; i++) {
			let row = "<tr style='height: 40px'>";

			for (let j = 0; j < 3; j++) {
				row += "<td></td>";
			}

			row += "</tr>";

			$(".exp-date-soclose-table > tbody").append(row);
		}
	}
}

fillExpDateOverTable();
fillExpDateSoCloseTable();
