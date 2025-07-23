const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;
let tray;
let serverProcess;

// Função para verificar se a porta está livre
function checkPort(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();
        server.listen(port, () => {
            server.once('close', () => {
                resolve(true);
            });
            server.close();
        });
        server.on('error', () => {
            resolve(false);
        });
    });
}

// Função para matar processos na porta
async function killPort(port) {
    const { exec } = require('child_process');
    return new Promise((resolve) => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
            if (stdout) {
                const lines = stdout.split('\n');
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 4) {
                        const pid = parts[4];
                        exec(`taskkill /F /PID ${pid}`, () => {});
                    }
                });
            }
            setTimeout(resolve, 1000);
        });
    });
}

// Iniciar servidor
async function startServer() {
    try {
        // Verificar porta 3000
        const portFree = await checkPort(3000);
        if (!portFree) {
            console.log('⚠️ Porta 3000 em uso, liberando...');
            await killPort(3000);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Iniciar servidor simples
        console.log('📡 Iniciando servidor...');
        const serverPath = path.join(__dirname, '..', 'servidor-simples.js');
        serverProcess = spawn('node', [serverPath], {
            stdio: 'pipe',
            cwd: path.join(__dirname, '..')
        });

        serverProcess.stdout.on('data', (data) => {
            console.log('Servidor:', data.toString().trim());
        });

        serverProcess.stderr.on('data', (data) => {
            console.log('Erro do servidor:', data.toString().trim());
        });

        // Aguardar servidor iniciar
        await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
    }
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
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'icon.png'),
        show: false,
        titleBarStyle: 'default',
        autoHideMenuBar: false
    });

    // Carregar a aplicação
    mainWindow.loadURL('http://localhost:3000');

    // Mostrar janela quando carregada
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // Fechar para bandeja do sistema
    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    // Quando a janela é fechada
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
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
            label: 'Abrir Aplicação',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        {
            label: 'Recarregar',
            click: () => {
                if (mainWindow) {
                    mainWindow.reload();
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Sair',
            click: () => {
                app.isQuiting = true;
                if (serverProcess) {
                    serverProcess.kill();
                }
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

    // Clique duplo para abrir
    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// Quando o Electron terminar de inicializar
app.whenReady().then(async () => {
    // Iniciar servidor primeiro
    await startServer();
    
    // Criar janela e bandeja
    createWindow();
    createTray();

    // No macOS, recriar janela quando o dock é clicado
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Fechar quando todas as janelas estão fechadas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Antes de sair
app.on('before-quit', () => {
    app.isQuiting = true;
    if (serverProcess) {
        serverProcess.kill();
    }
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
    console.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rejeitada não tratada:', reason);
}); 