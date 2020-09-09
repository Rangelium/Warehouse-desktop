const electron = require("electron");
const path = require("path");
const { download } = require("electron-dl");
const { app, BrowserWindow, screen, ipcMain, Menu, globalShortcut } = electron;
const { MyCustomMenu } = require("./tools/customMenu");
// require("events").EventEmitter.defaultMaxListeners = Infinity;

// ====================================================================================
//  														  Initialization part
// ====================================================================================

// Initializing windows
let mainWindow;

global.USER = "Not Authorized";

// Create mainWindow
app.on("ready", () => {
	mainWindow = new BrowserWindow({
		width: screen.getPrimaryDisplay().workAreaSize.width,
		height: screen.getPrimaryDisplay().workAreaSize.height,
		webPreferences: {
			nodeIntegration: true,
			webviewTag: true,
		},
	});
	mainWindow.maximize();
	// mainWindow.resizable = false;

	// Remove buil in menu
	Menu.setApplicationMenu(null);

	//Dev Tools
	// mainWindow.webContents.openDevTools();

	ipcMain.on("downloadReport", (event, info) => {
		download(BrowserWindow.getFocusedWindow(), info.url, info.properties).then((dl) =>
			mainWindow.webContents.send("downloadReport complete", dl.getSavePath())
		);
	});
	// Start Anbar Form
	startAnbarForm();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") app.quit();
});

// ====================================================================================
//  															  Anbar Form part
// ====================================================================================

// Load main Anbar Form
function startAnbarForm() {
	// Load data of Anbar Form in Browser window
	mainWindow.loadFile(path.join(__dirname, "anbarForm/anbar.html"));
	// Working with loaded data
	mainWindow.webContents.once("dom-ready", () => {
		// Create menu template
		let AppMenu = new MyCustomMenu(mainWindow);

		AppMenu.addItems([
			// Anbar info
			{
				label: "Anbar haqqında",
				name: "anbarInfo",
				shortcut: "ctrl+shift+i",
				click: function () {
					mainWindow.webContents.send("changeAnbarPage", "anbarInfo");
				},
			},
			// Anbar add
			{
				label: "Mədaxil",
				name: "anbarAdd",
				shortcut: "ctrl+shift+a",
				click: function () {
					mainWindow.webContents.send("changeAnbarPage", "anbarAdd");
				},
			},
			// Anbar remove
			{
				label: "Məxaric",
				name: "anbarRemove",
				shortcut: "ctrl+shift+r",
				click: function () {
					mainWindow.webContents.send("changeAnbarPage", "anbarRemove");
				},
			},
			{
				label: "M.A.Ş",
				name: "productAuth",
				shortcut: "ctrl+shift+p",
				click: function () {
					mainWindow.webContents.send("changeAnbarPage", "productAuth");
				},
			},
			// Lists(Soraqcalar)
			{
				label: "Siyahı",
				submenu: [
					{
						label: "Bağlama",
						name: "packaging",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "packaging");
						},
					},
					{
						label: "Valyutalar",
						name: "currency",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "currency");
						},
					},
					{
						label: "Məzənnə",
						name: "treasury",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "treasury");
						},
					},
					{
						label: "Təchizatçılar",
						name: "sellers",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "sellers");
						},
					},
					{
						label: "Yararlılıq müddəti keçmiş/sona yaxın məhsullar",
						name: "expDateProducts",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "expDateProducts");
						},
					},
				],
			},
			// Reports(Hesabatlar)
			{
				label: "Reportlar",
				submenu: [
					{
						label: "İnventarizasiya",
						name: "inventory",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "inventory");
						},
					},
					{
						label: "Reportlar",
						name: "report",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "report");
						},
					},
				],
			},
			// Admin
			{
				label: "Admin Panel",
				submenu: [
					{
						label: "İstifadəçilər siyahıları",
						name: "usersList",
						click: function () {
							mainWindow.webContents.send("changeAnbarPage", "usersList");
						},
					},
					// {
					// 	label: "Logs",
					// 	name: "logs",
					// 	click: function () {
					// 		mainWindow.webContents.send("changeAnbarPage", "logs");
					// 	},
					// },
				],
			},
		]);

		AppMenu.setSettings({
			label: "Menyu",
			submenu: [
				{
					label: "Parametrlər",
					click: function () {
						mainWindow.webContents.send("openSettings");
					},
				},
				{
					label: "Logout",
					click: function () {
						mainWindow.webContents.send("userLogOut");
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

		globalShortcut.register("Ctrl+I", () => {
			mainWindow.webContents.toggleDevTools();
		});
	});
}
