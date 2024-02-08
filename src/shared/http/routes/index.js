import { Router } from "express";
import routes from "./routes";
import { decodeToken } from "@shared/providers/token";
const router = Router();
router.use((req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const [_, token] = authorization.split(" ");
    const user = decodeToken(token);
    req.user = user;
  }
  next();
});
router.get("/", (req, res) => {
  return res.json({
    api: {
      nome: "API projeto garanhuns",
      contato: "suporte@digitalazul.com.br",
    },
  });
});

router.use(routes);
export default router;
