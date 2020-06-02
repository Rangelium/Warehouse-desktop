const electron = require("electron");
const path = require("path");

const { app, BrowserWindow, screen, ipcMain, Menu, globalShortcut } = electron;
const { MyCustomMenu } = require("./tools/customMenu");
const { sha256 } = require("./tools/sha256");
const mssql = require("mssql");

// DataBase
let config = {
	user: "oper",
	password: "fox12",
	server: "172.16.3.42",
};

// ====================================================================================
//  														  Initialization part
// ====================================================================================

// Initializing windows
let mainWindow;

// Create mainWindow
app.on("ready", () => {
	mainWindow = new BrowserWindow({
		width: screen.getPrimaryDisplay().workAreaSize.width,
		height: screen.getPrimaryDisplay().workAreaSize.height,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	mainWindow.webContents.openDevTools();
	// Remove buil in menu
	Menu.setApplicationMenu(null);
	startLoginForm();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") app.quit();
});

// ====================================================================================
//  															Login/Logout system part
// ====================================================================================

// Main login fuction
ipcMain.on("userLoginClick", (e, userLoginData) => {
	config.database = "main";

	let pool = new mssql.ConnectionPool(config);
	let poolConnect = pool.connect();

	let username = userLoginData.username;
	let password = sha256(userLoginData.password);
	poolConnect
		.then((pool) => {
			pool
				.request()
				.input("username", mssql.NVarChar(250), username)
				.input("password", mssql.NVarChar(250), password)
				.execute("dbo.user_login_check", (err, res) => {
					if (res.recordset[0][""] == 1) {
						startAnbarForm();
						return;
					} else {
						mainWindow.webContents.send("userLoginFalse");
					}
				});
		})
		.catch((err) => console.log(err));
});

function userLogOut() {
	startLoginForm();
}

// ====================================================================================
//  															  Login Form part
// ====================================================================================

// Load main Anbar Form
function startLoginForm() {
	// Load login Form
	mainWindow.loadFile(path.join(__dirname, "forms/loginForm/login.html"));

	mainWindow.webContents.once("dom-ready", () => {});
}

// ====================================================================================
//  															  Anbar Form part
// ====================================================================================

// Load main Anbar Form
function startAnbarForm() {
	// Load data of Anbar Form in Browser window
	mainWindow.loadFile(path.join(__dirname, "forms/anbarForm/anbar.html"));

	// Working with loaded data
	mainWindow.webContents.once("dom-ready", () => {
		// Create menu template
		let AppMenu = new MyCustomMenu(mainWindow);

		AppMenu.addItems([
			// Anbar info
			{
				label: "Anbar info",
				name: "anbarInfo",
				shortcut: "ctrl+shift+i",
				click: function () {
					mainWindow.webContents.send("changeAnbarPage", "anbarInfo");
				},
			},
			// Anbar add
			{
				label: "Anbar add",
				name: "anbarAdd",
				shortcut: "ctrl+shift+a",
				click: function () {
					mainWindow.webContents.send("changeAnbarPage", "anbarAdd");
				},
			},
			// Anbar remove
			{
				label: "Anbar remove",
				name: "anbarRemove",
				shortcut: "ctrl+shift+r",
				click: function () {
					mainWindow.webContents.send("changeAnbarPage", "anbarRemove");
				},
			},
			// Lists(Soraqcalar)
			{
				label: "Lists",
				submenu: [
					{
						label: "Packaging",
						name: "packaging",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "packaging");
						},
					},
					{
						label: "Currency",
						name: "currency",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "currency");
						},
					},
					{
						label: "Treasury",
						name: "treasury",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "treasury");
						},
					},
				],
			},
			// Reports(Hesabatlar)
			{
				label: "Reports",
				submenu: [
					{
						label: "Invetory",
						name: "inventory",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "inventory");
						},
					},
				],
			},
			// Admin
			{
				label: "Admin",
				submenu: [
					{
						label: "Users list",
						name: "usersList",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "usersList");
						},
					},
					{
						label: "Logs",
						name: "logs",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "logs");
						},
					},
				],
			},
		]);

		AppMenu.setSettings({
			label: "Settings",
			submenu: [
				{
					label: "Logout",
					click: function () {
						userLogOut();
					},
				},
				{
					label: "Quit",
					shortcut: "Ctrl+Q",
					click: function () {
						app.quit();
					},
				},
			],
		});

		// Show menu in browser window
		AppMenu.renderMenu();

		globalShortcut.register("Ctrl+R", function () {
			startAnbarForm();
		});
		globalShortcut.register("Ctrl+I", () => {
			mainWindow.webContents.toggleDevTools();
		});
	});
}
// ====================================================================================
//  															  Anbar Pages Part
// ====================================================================================

ipcMain.on("logsTable", (event, arg) => {
	config.database = "main";

	let pool = new mssql.ConnectionPool(config);
	let poolConnect = pool.connect();

	poolConnect
		.then((pool) => {
			pool.request()
				.execute("dbo.exec_all_logs", (err, res) => {
					event.reply("logsTableReply", res.recordset)
				})
		}).catch((err) => console.log(err))
})
