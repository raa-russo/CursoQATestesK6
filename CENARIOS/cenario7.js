import Login from "../login/login.js";
import CadastarUsuarios from "../usuarios/cadastrarUsers.js";
import CadastarProdutos from "../produtos/cadastrar.js";
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
      { duration: "1s", target: 1 },      
  
    ],
    thresholds: {
      http_req_duration: ['p(90) < 2000'],
      http_req_failed: ['rate<0.05']
    }
  }

export default () => {
    group('Endpoint Login de usuários - Serverest.Api', () => {
      Login();
    });   

    group('Endpoint Cadastar Usuário - Serverest.Api', () => {
      CadastarUsuarios();
    });

    group('Endpoint Cadastrar Produtos - Serverest.Api', () => {
      CadastarProdutos();
    });
    
    sleep(2);
}
//run test => k6 run cenarios/cenario7.js