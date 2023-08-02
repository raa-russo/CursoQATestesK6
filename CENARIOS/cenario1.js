import Login from "../login/login.js";
import CadastarUsuarios from "../usuarios/cadastrarUsers.js";
import ListarUsuarios from "../usuarios/listarUsers.js";
import ListarProdutos from "../produtos/listar.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }
//smoke test
  export const options = {
    stages: [
      { duration: '1s', target: 1 },
      
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
//run test => k6 run cenarios/cenario1.js