import { generateToken } from "@shared/providers/token";
export class AuthService {
  gerar_token_aluno(aluno) {
    return generateToken(aluno);
  }
  gerar_token_admin(admin) {
    return generateToken(admin);
  }
}
