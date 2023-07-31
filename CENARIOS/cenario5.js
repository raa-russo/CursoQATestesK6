import Login from "../login/login.js";
import ListarUsuariosId from "../usuarios/listarUsersId.js";
import ListarProdutosId from "../produtos/listar_Id.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }

  export const options = {
    stages: [
      { duration: "5s", target: 100 },
      { duration: "20s", target: 100 },
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

    group('Endpoint Listar usuários por id- Serverest.Api', () => {
      ListarUsuariosId();
    });    

    group('Endpoint Listar Produtos por id - Serverest.Api', () => {
      ListarProdutosId();
    });

    sleep(1);
}