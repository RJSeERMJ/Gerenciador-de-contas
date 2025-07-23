const cron = require('node-cron');
const database = require('../database/database');
const notificationService = require('./notificationService');

class CronService {
    constructor() {
        this.jobs = [];
    }

    async iniciar() {
        console.log('🕐 Iniciando agendamento de tarefas...');

        // Verificar contas vencendo todos os dias às 9h
        this.jobs.push(
            cron.schedule('0 9 * * *', async () => {
                console.log('📅 Verificando contas vencendo...');
                await this.verificarContasVencendo();
            }, {
                timezone: 'America/Sao_Paulo'
            })
        );

        // Verificar contas vencidas todos os dias às 10h
        this.jobs.push(
            cron.schedule('0 10 * * *', async () => {
                console.log('🚨 Verificando contas vencidas...');
                await this.verificarContasVencidas();
            }, {
                timezone: 'America/Sao_Paulo'
            })
        );

        // Verificar contas vencendo também às 18h
        this.jobs.push(
            cron.schedule('0 18 * * *', async () => {
                console.log('📅 Verificando contas vencendo (segunda verificação)...');
                await this.verificarContasVencendo();
            }, {
                timezone: 'America/Sao_Paulo'
            })
        );

        console.log('✅ Agendamento iniciado com sucesso');
        console.log('   - Verificação de contas vencendo: 9h e 18h');
        console.log('   - Verificação de contas vencidas: 10h');
    }

    async verificarContasVencendo() {
        try {
            const contasVencendo = await database.getContasVencendo();
            
            if (contasVencendo.length > 0) {
                console.log(`📱 Enviando notificação para ${contasVencendo.length} conta(s) vencendo`);
                await notificationService.enviarNotificacaoContasVencendo(contasVencendo);
            } else {
                console.log('✅ Nenhuma conta vencendo nos próximos dias');
            }
        } catch (error) {
            console.error('❌ Erro ao verificar contas vencendo:', error);
        }
    }

    async verificarContasVencidas() {
        try {
            const contasVencidas = await database.getContasVencidas();
            
            if (contasVencidas.length > 0) {
                console.log(`🚨 Enviando notificação para ${contasVencidas.length} conta(s) vencida(s)`);
                await notificationService.enviarNotificacaoContasVencidas(contasVencidas);
            } else {
                console.log('✅ Nenhuma conta vencida');
            }
        } catch (error) {
            console.error('❌ Erro ao verificar contas vencidas:', error);
        }
    }

    async verificarAgora() {
        console.log('🔍 Verificação manual iniciada...');
        await this.verificarContasVencendo();
        await this.verificarContasVencidas();
        console.log('✅ Verificação manual concluída');
    }

    parar() {
        this.jobs.forEach(job => job.stop());
        console.log('🛑 Agendamento parado');
    }
}

module.exports = new CronService(); 