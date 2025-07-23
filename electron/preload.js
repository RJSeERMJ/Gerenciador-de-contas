const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Obter versão da aplicação
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    
    // Mostrar notificação
    showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
    
    // Verificar se está em modo desktop
    isDesktop: true,
    
    // Eventos de notificação
    onNotification: (callback) => {
        ipcRenderer.on('notification', callback);
    }
});

// Expor algumas funções úteis
contextBridge.exposeInMainWorld('desktopUtils', {
    // Verificar se é aplicação desktop
    isDesktopApp: true,
    
    // Função para mostrar notificação desktop
    showDesktopNotification: (title, body) => {
        if (window.electronAPI) {
            window.electronAPI.showNotification(title, body);
        }
    },
    
    // Função para obter informações da aplicação
    getAppInfo: async () => {
        if (window.electronAPI) {
            const version = await window.electronAPI.getAppVersion();
            return {
                version,
                platform: 'desktop',
                name: 'Gerenciador de Contas'
            };
        }
        return null;
    }
}); 