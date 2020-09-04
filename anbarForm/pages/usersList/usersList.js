var userSelectedId = "";

function fillTable() {
	poolConnect.then((pool) => {
		pool.request().execute("anbar.user_select_all", (err, res) => {
			data = [];
			for (let i of res.recordset) {
				data.push(i);
			}
			$(".userListProductTable").remove();

			$(".userList-table-data").append(
				"<table class='userListProductTable'></table>"
			);
			$(".userListProductTable").append("<thead></thead>");
			$(".userListProductTable").append("<tbody></tbody>");

			$(".userListProductTable > thead").append(
				`<th>${languages["username"]}:</th>`
			);
			$(".userListProductTable > thead").append(
				`<th>${languages["firstname"]}:</th>`
			);
			$(".userListProductTable > thead").append(
				`<th>${languages["secondname"]}:</th>`
			);
			$(".userListProductTable > thead").append(
				`<th>${languages["privelage"]}:</th>`
			);

			data.forEach((el) => {
				let row = "<tr>";
				row += `<td>${el.username}</td>`;
				row += `<td>${el.name}</td>`;
				row += `<td>${el.surname}</td>`;
				row += `<td>${el.privelage}</td>`;
				row += "</tr>";
				$(".userListProductTable > tbody").append(row);
				$(".userListProductInfo").css("opacity", "1");
				$(".userListProductInfo").css("pointer-events", "unset");
				let tr = document.querySelectorAll("tbody tr");
				tr.forEach((el) => {
					el.addEventListener("click", () => {
						tr.forEach((trel) => {
							trel.classList.remove("selected");
						});
						el.classList.toggle("selected");
						userSelectedId = el.firstChild.textContent;
					});
				});
			});
		});
	});
}
fillTable();

poolConnect.then((pool) => {
	pool.request().execute("anbar.user_privelage_select", (err, res) => {
		let data = [];
		for (let i of res.recordset) {
			data.push(i);
		}
		for (let result of data) {
			$("#privelageSelect").append(
				$("<option>", { value: result["id"], text: result["title"] })
			);
		}
	});
});

$(".userListInputButton").click(() => {
	$(".userListPopUpContainer").show();
});
$(".userListPopupCloseButton").click(() => {
	$(".userListPopUpContainer").hide();
});

$(".userListDeleteButton").click(() => {
	if (userSelectedId == "" || userSelectedId == " ") {
		alert("Select row");
		return;
	}
	poolConnect.then((pool) => {
		pool
			.request()
			.input("username", mssql.NVarChar(250), userSelectedId)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.user_delete", (err, res) => {
				console.log(res);
				fillTable();
			});
	});
});

$(".addUserButton").on("click", () => {
	let username = $("#userListUsername").val();
	let name = $("#name").val();
	let surname = $("#surname").val();
	let password = $("#userListPassword").val();
	let privelage = $("#privelageSelect").val();
	console.log(surname + " " + name + " " + username + " " + password);
	if (
		username.length == 0 ||
		name.length == 0 ||
		surname.length == 0 ||
		password.length == 0
	) {
		alert("All fields must be filled");
		return;
	}
	password = sha256(password);
	poolConnect.then((pool) => {
		pool
			.request()
			.input("username", mssql.NVarChar(250), username)
			.input("name", mssql.NVarChar(250), name)
			.input("surname", mssql.NVarChar(250), surname)
			.input("password", mssql.NVarChar(250), password)
			.input("privelage", mssql.Int, privelage)
			.input("user_id", mssql.Int, USER["id"])
			.execute("anbar.user_insert", (err, res) => {
				console.log(res);
				$("input").val("");
				fillTable();
			});
	});
});
