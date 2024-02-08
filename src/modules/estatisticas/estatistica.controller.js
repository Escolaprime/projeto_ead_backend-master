

export class EstatisticaController {
    estatisticaService
    constructor(estatisticaService) {
        this.estatisticaService = estatisticaService;
    }

    async inserir_estatisticas_videos(req,res) {
     const response = await this.estatisticaService.inserir_estatistica_aluno(req.body);

     return res.json({
        response
     })
    }

    async atualizar_estatistica_video(req,res) {
        const response = await this.estatisticaService.atualizar_estatistica_aluno(req.body);

        return res.json({
           response
        })
    }
}