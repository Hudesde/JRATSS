import { Router } from "express";
import { observacionController } from "../controllers/observacionController";


class ObservacionRoutes{
    public router:Router = Router();
    constructor(){
        this.config();
    }
    config(): void {
        this.router.get('/', (req, res) => {
            res.send('Observaciones API');
        });
        this.router.get('/list', observacionController.list);
        this.router.get('/list/:id', observacionController.listOne);
        this.router.post('/create', observacionController.create);
        this.router.put('/update/:id', observacionController.update);
        this.router.delete('/delete/:id', observacionController.delete);
        this.router.get('/cita/:cita_id', observacionController.getObservacionesByCita);

    }
}
const observacionRoutes = new ObservacionRoutes();
export default observacionRoutes.router;