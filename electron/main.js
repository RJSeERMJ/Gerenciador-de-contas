const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let tray;
let serverProcess;

// Iniciar servidor backend
function startServer() {
    const { spawn } = require('child_process');
    serverProcess = spawn('node', ['server.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
    });

    serverProcess.stdout.on('data', (data) => {
        console.log('Servidor:', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
        console.error('Erro do servidor:', data.toString());
    });
}

// Criar janela principal
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'icon.png'), // Opcional - remove se não existir
        titleBarStyle: 'default',
        show: false,
        backgroundColor: '#667eea'
    });

    // Carregar a aplicação
    const startUrl = isDev ? 'http://localhost:3000' : 'http://localhost:3000';
    mainWindow.loadURL(startUrl);

    // Mostrar janela quando estiver pronta
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Verificar se o servidor está rodando
        setTimeout(() => {
            mainWindow.webContents.executeJavaScript(`
                fetch('/api/contas')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Servidor não está respondendo');
                        }
                        console.log('✅ Servidor funcionando');
                    })
                    .catch(error => {
                        console.error('❌ Erro no servidor:', error);
                        // Tentar reiniciar o servidor
                        window.location.reload();
                    });
            `);
        }, 2000);
    });

    // Eventos da janela
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('minimize', (event) => {
        event.preventDefault();
        mainWindow.hide();
        showNotification('Gerenciador de Contas', 'Aplicação minimizada para a bandeja do sistema');
    });

    // Menu da aplicação
    createMenu();
}

// Criar menu da aplicação
function createMenu() {
    const template = [
        {
            label: 'Arquivo',
            submenu: [
                {
                    label: 'Nova Conta',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            if (typeof abrirModalNovaConta === 'function') {
                                abrirModalNovaConta();
                            }
                        `);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exportar Contas',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            if (typeof exportarContas === 'function') {
                                exportarContas();
                            }
                        `);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Sair',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' }
            ]
        },
        {
            label: 'Visualizar',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Janela',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre',
                    click: () => {
                        showAboutDialog();
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Criar ícone na bandeja do sistema
function createTray() {
    let iconPath = path.join(__dirname, 'tray-icon.png');
    
    // Se o ícone não existir, criar um ícone padrão
    if (!require('fs').existsSync(iconPath)) {
        iconPath = path.join(__dirname, 'tray-icon.svg');
        if (!require('fs').existsSync(iconPath)) {
            // Criar ícone padrão
            const { createCanvas } = require('canvas');
            try {
                const canvas = createCanvas(32, 32);
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#667eea';
                ctx.fillRect(0, 0, 32, 32);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', 16, 16);
                const buffer = canvas.toBuffer('image/png');
                require('fs').writeFileSync(iconPath, buffer);
            } catch (e) {
                // Se não conseguir criar, usar ícone padrão do sistema
                iconPath = null;
            }
        }
    }
    
    const icon = iconPath ? nativeImage.createFromPath(iconPath) : null;
    
    tray = new Tray(icon);
    tray.setToolTip('Gerenciador de Contas');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Abrir Gerenciador de Contas',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        {
            label: 'Nova Conta',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                    mainWindow.webContents.executeJavaScript(`
                        if (typeof abrirModalNovaConta === 'function') {
                            abrirModalNovaConta();
                        }
                    `);
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Sair',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// Mostrar notificação
function showNotification(title, body) {
    if (process.platform === 'win32') {
        const { Notification } = require('electron');
        new Notification({ title, body }).show();
    }
}

// Mostrar diálogo sobre
function showAboutDialog() {
    const { dialog } = require('electron');
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Sobre Gerenciador de Contas',
        message: 'Gerenciador de Contas',
        detail: 'Versão 1.0.0\n\nUm sistema completo para gerenciar suas contas do mês com notificações por SMS e WhatsApp.\n\nDesenvolvido com ❤️ para ajudar você a gerenciar suas finanças!'
    });
}

// Eventos da aplicação
app.whenReady().then(() => {
    startServer();
    createWindow();
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});

// Eventos IPC
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('show-notification', (event, title, body) => {
    showNotification(title, body);
});

// Prevenir múltiplas instâncias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
} 