import { EstatisticaController } from "./estatistica.controller";
import { EstatisticaService } from "./estatistica.service"


const factory = () => {
    const service = new EstatisticaService();
    const controller = new EstatisticaController(service);
    return controller
}

export default factory()