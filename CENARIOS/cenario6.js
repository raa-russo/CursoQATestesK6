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

  //stress test
  export const options = {
    stages: [
      { duration: "20s", target: 100 },
      { duration: "30s", target: 100 },
      { duration: "20s", target: 200 },
      { duration: "30s", target: 200 },
      { duration: "10s", target: 300 },
      { duration: "20s", target: 300 },
      { duration: "30s", target: 400 },
      { duration: "10s", target: 0 },
  
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

    group('Endpoint Cadastar Usuário - Serverest.Api', () => {
      CadastarUsuarios();
    });

    group('Endpoint Cadastrar Produtos - Serverest.Api', () => {
      CadastarProdutos();
    });
    console.log(resposta.body)
    sleep(2);
}
//run test => k6 run cenarios/smokeTest_post.js