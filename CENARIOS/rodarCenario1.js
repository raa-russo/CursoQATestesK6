import Login from "./cenario1/login.js";
import ListarUsuarios from "./cenario1/listar_user.js";
import CadastarUsuarios from "./cenario1/cad_prod.js";
import ListarProdutos from "./cenario1/list_prod.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }

  export const options = {
    stages: [
      { duration: '30s', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '30s', target: 200 },
      { duration: '1m', target: 100 },
      { duration: '3m', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'], 
      http_req_failed: ['rate<0.01'] 
    }
  }

export default () => {
    group('Endpoint Login de usuários - Serverest.Api', () => {
      Login();
    });

    group('Endpoint Listar usuários - Serverest.Api', () => {
      ListarUsuarios();
    });

    group('Endpoint Cadastar Usuário - Serverest.Api', () => {
      CadastarUsuarios();
    });

    group('Endpoint Listar Produtos - Serverest.Api', () => {
      ListarProdutos();
    });

    sleep(1);
}