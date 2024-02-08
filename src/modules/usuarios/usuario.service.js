import db from "@shared/database/knex";
export class UsuarioService {
  /*
RECEBE O ID DO USUARIO CORRENTE
RECEBE O EMAIL DO INPUT DO FORM
ANALISA SE O EMAIL É DO USUÁRIO SE SIM RETORNA >> 0
SE NÃO ANALISA SE O EMAIL JÁ EXISTE NA BASE DE DADOS SE SIM REOTRNA 1 
SE NÃO RETORNA 0 
*/
  async CHECA_EMAIL_USUARIO(email) {
    try {
      const rows = await db
        .table("usuarios")
        .select("id", "email")
        .where("email", email);
      if (rows != undefined && rows.length > 0) {
        return 1; // email de outro usuario
      } else {
        return 0; // não email cadastrado no DB
      }
    } catch (error) {
      console.log(error);
    }
  }
}
