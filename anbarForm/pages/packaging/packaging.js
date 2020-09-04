var packagingSelectedId = -1;

function fillTable() {
	poolConnect.then((pool) => {
		pool.request().execute("anbar.cluster_names_select_all", (err, res) => {
			data = [];
			for (let i of res.recordset) {
				data.push(i);
			}
			$(".packagingProductTable").remove();

			$(".packaging-table-data").append(
				"<table class='packagingProductTable'></table>"
			);
			$(".packagingProductTable").append("<thead></thead>");
			$(".packagingProductTable").append("<tbody></tbody>");

			$(".packagingProductTable > thead").append(
				`<th>${languages["unit"]}:</th>`
			);

			data.forEach((el) => {
				let row = `<tr>`;
				row += `<td style="display:none" id="packagingId">${el.id}</td>`;
				row += `<td>${el.title}</td>`;
				row += "</tr>";
				$(".packagingProductTable > tbody").append(row);
			});
			$(".packagingProductInfo").css("opacity", "1");
			$(".packagingProductInfo").css("pointer-events", "unset");
			let tr = document.querySelectorAll("tbody tr");
			tr.forEach((el) => {
				el.addEventListener("click", () => {
					tr.forEach((trel) => {
						trel.classList.remove("selected");
					});
					el.classList.toggle("selected");
					packagingSelectedId = el.firstChild.textContent;
				});
			});
		});
	});
}
fillTable();

$(".packagingInputButton").on("click", () => {
	let title = $("#title").val();
	if (title.length == 0) {
		alert("All fields must be filled");
		return;
	}

	poolConnect.then((pool) => {
		pool
			.request()
			.input("title", mssql.NVarChar(250), title)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.cluster_names_insert", (err, res) => {
				console.log(err);
				$("input").val("");
				fillTable();
			});
	});
});

$(".packagingDeleteButton").on("click", () => {
	if (packagingSelectedId < 0) {
		alert("Please select the row");
		return;
	}
	poolConnect.then((pool) => {
		pool
			.request()
			.input("id", mssql.Int, packagingSelectedId)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.cluster_names_delete", (err, res) => {
				console.log(err);
				fillTable();
			});
	});
});
