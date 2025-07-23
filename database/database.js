const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        const dbPath = process.env.DB_PATH || './database/contas.db';
        const dbDir = path.dirname(dbPath);
        
        // Criar diretório se não existir
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }
        
        this.db = new sqlite3.Database(dbPath);
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Criar tabela de contas
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS contas (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        descricao TEXT NOT NULL,
                        valor REAL NOT NULL,
                        dataVencimento TEXT NOT NULL,
                        categoria TEXT,
                        paga BOOLEAN DEFAULT 0,
                        recorrente BOOLEAN DEFAULT 0,
                        dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP,
                        dataPagamento TEXT
                    )
                `, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
    }

    async getAllContas() {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT * FROM contas 
                ORDER BY dataVencimento ASC
            `, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async addConta(conta) {
        return new Promise((resolve, reject) => {
            const { descricao, valor, dataVencimento, categoria, recorrente, paga } = conta;
            this.db.run(`
                INSERT INTO contas (descricao, valor, dataVencimento, categoria, recorrente, paga)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [descricao, valor, dataVencimento, categoria, recorrente ? 1 : 0, paga ? 1 : 0], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...conta });
                }
            });
        });
    }

    async updateConta(id, conta) {
        return new Promise((resolve, reject) => {
            const { descricao, valor, dataVencimento, categoria, recorrente, paga } = conta;
            this.db.run(`
                UPDATE contas 
                SET descricao = ?, valor = ?, dataVencimento = ?, categoria = ?, recorrente = ?, paga = ?
                WHERE id = ?
            `, [descricao, valor, dataVencimento, categoria, recorrente ? 1 : 0, paga ? 1 : 0, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id, ...conta });
                }
            });
        });
    }

    async deleteConta(id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM contas WHERE id = ?', [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async marcarComoPaga(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                UPDATE contas 
                SET paga = 1, dataPagamento = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    this.db.get('SELECT * FROM contas WHERE id = ?', [id], (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    });
                }
            });
        });
    }

    async getContasVencendo() {
        return new Promise((resolve, reject) => {
            const hoje = new Date().toISOString().split('T')[0];
            const proximos7Dias = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            this.db.all(`
                SELECT * FROM contas 
                WHERE paga = 0 
                AND dataVencimento BETWEEN ? AND ?
                ORDER BY dataVencimento ASC
            `, [hoje, proximos7Dias], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getContasVencidas() {
        return new Promise((resolve, reject) => {
            const hoje = new Date().toISOString().split('T')[0];
            
            this.db.all(`
                SELECT * FROM contas 
                WHERE paga = 0 
                AND dataVencimento < ?
                ORDER BY dataVencimento ASC
            `, [hoje], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = new Database(); 