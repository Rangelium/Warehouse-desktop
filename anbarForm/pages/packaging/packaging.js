var packagingSelectedId = -1;
var restoreId = -1;
var table_name = "anbar.cluster_names";
function fillDeletedTable(){
	poolConnect.then((pool) => {
		pool.request()
				.input("table_name", mssql.NVarChar(250), table_name)
				.execute("anbar.return_all_deleted_from_table", (err, res) => {
					if(err != null){
						console.log("Error:", err);
					}
					console.log(res);
					data = [];
					for (let i of res.recordset) {
						data.push(i);
					}
					$("#deletedTable").remove();

					$("#deletedTableData").append(
						"<table class='packagingProductTable' id='deletedTable'></table>"
					);
					$("#deletedTable").append("<thead></thead>");
					$("#deletedTable").append("<tbody></tbody>");
					
					$("#deletedTable > thead").append(
						`<th>${languages["unit"]}:</th>`
					);

					data.forEach((el) => {
						let row = "<tr>";
						row += `<td style="display: none">${el.restore_id}</td>`;
						row += `<td>${el.title}</td>`;
						row += `</tr>`
						$("#deletedTable > tbody").append(row);
					})
					$("#deletedInfo").css("opacity", "1");
					$("#deletedInfo").css("pointer-events", "unset");
					
					// let tr = document.querySelector("#deletedTable tbody tr");
					
					$("#deletedTable tbody tr").mousedown(function(e){
						if(e.button == 2){
							$("#deletedTable tbody tr").removeClass("selected");
							$(this).addClass("selected");
							restoreId = this.firstChild.textContent;
							let x = e.pageX;
							let y = e.pageY;
							let optionCard = $(".optionsCard");
							optionCard.css({
								left: x,
								top: y,
								display: "flex"
							});
							return false;
						}
						return true;
					})
				})
				
	})
}

function fillTable() {
	poolConnect.then((pool) => {
		pool.request().execute("anbar.cluster_names_select_all", (err, res) => {
			data = [];
			for (let i of res.recordset) {
				data.push(i);
			}
			$("#packageTable").remove();

			$("#packageTableData").append(
				"<table class='packagingProductTable' id='packageTable'></table>"
			);
			$("#packageTable").append("<thead></thead>");
			$("#packageTable").append("<tbody></tbody>");

			$("#packageTable > thead").append(
				`<th>${languages["unit"]}:</th>`
			);

			data.forEach((el) => {
				let row = `<tr>`;
				row += `<td style="display:none" id="packagingId">${el.id}</td>`;
				row += `<td>${el.title}</td>`;
				row += "</tr>";
				$("#packageTable > tbody").append(row);
			});
			$("#packageProductInfo").css("opacity", "1");
			$("#packageProductInfo").css("pointer-events", "unset");
			let tr = document.querySelectorAll("#packageTable tbody tr");
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

$("#addButton").on("click", () => {
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

$("#deleteButton").on("click", () => {
  if(packagingSelectedId < 0){
    alert("Please select the row");
    return;
  }
  poolConnect.then((pool) => {
    pool.request()
        .input("id", mssql.Int, packagingSelectedId)
        .input("user_id", mssql.Int, USER['id'])
        .execute("anbar.cluster_names_delete", (err, res) => {
          console.log(err);
          fillTable();
        })
  })
})

$("#restoreSection").click(function (){
	if($(this).attr("data-state") == "restore"){
		fillDeletedTable();
		$(this).text("Clusters");
		$("#mainContainer").fadeOut(100);
		$("#restoreContainer").fadeIn(100);
		$(this).attr("data-state", "clusters")
	}
	else{
		fillTable();
		$(this).text("Restore");
		$("#restoreContainer").fadeOut(100);
		$("#mainContainer").fadeIn(100);		
		$(this).attr("data-state", "restore");
	}
})

$(".optionsCard .optionsElement#returnElement").click(function(){
	$(".optionsCard").fadeOut(100);
	if(restoreId >= 0)
	poolConnect.then((pool) => {
		pool.request()
				.input("restore_id", mssql.Int, restoreId)
				.execute("anbar.return_deleted", (err, res) => {
					if(err != null){
						console.log(err);
						return;
					}
					fillDeletedTable();
					fillTable();
				})
	})

})

$(document).click(() => {
	$(".optionsCard").fadeOut(20);
	$("#deletedTable tbody tr").removeClass("selected");
})