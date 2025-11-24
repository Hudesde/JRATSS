import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import citasRoutes from './routes/citasRoutes';
import usuariosRoutes from './routes/usuariosRoutes';
import observacionRoutes from './routes/observacionRoutes';
import bigfiveRoutes from './routes/bigfiveRoutes';
import sesionChatRoutes from './routes/sesionChatRoutes';
import resumenRoutes from './routes/resumenRoutes';
import chatRoutes from './routes/chatRoutes';

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        // Configura el puerto del servidor
        this.app.set('port', process.env.PORT || 3000);

        // Configura CORS para permitir peticiones externas (como desde ngrok o otras redes)
        this.app.use(cors({
            origin: '*', // ⚠️ En producción deberías reemplazar '*' por tu dominio seguro
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Middlewares adicionales
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes(): void { 
        // Definición de rutas
        this.app.use('/api/citas', citasRoutes);
        this.app.use('/api/usuarios', usuariosRoutes);
        this.app.use('/api/observaciones', observacionRoutes);
        this.app.use('/api/bigfive', bigfiveRoutes);
        this.app.use('/api/sesiones', sesionChatRoutes);
        this.app.use('/api/resumen', resumenRoutes);
        this.app.use('/api/chat', chatRoutes);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('🚀 Server running on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
