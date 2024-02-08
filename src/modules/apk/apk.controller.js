export class ApkController {
  apkService;
  constructor(apkService) {
    this.apkService = apkService;
  }
  async obter_versao_apk(req, res) {
    const { CRC } = req.query;
    if (CRC === "9") {
      try {
        const [versao_apk] = await db("parametros").select("parametro").where({
          classe_param: "VERSAO_APK",
        });

        return res.send(versao_apk);
      } catch (error) {
        return res.status(500).send({
          error: "Error interno",
        });
      }
    } else {
      return res.status(500).send({ error: "Error interno 2" });
    }
  }
}
