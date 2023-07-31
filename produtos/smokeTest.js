import CadastrarProdutos from "./cadastrar.js";
import EditarProdutos from "./editar.js";
import ExcluirProdutos from "./excluirProd.js";
import ListarProdutos from "./listarProd.js";
import ListarProdutosId from "./listarProd_Id.js";
import Login from "../login/login.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  stages: [
    { duration: '1s', target: 1 }    
  ],
  thresholds: {
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
    http_req_failed: ['rate<0.01']
  }
}

export default () => {
  group('Endpoint Login de usuario - Serverest.Api', () => {
    Login();
  });

  group('Endpoint Cadastrar Produtos - Serverest.Api', () => {
    CadastrarProdutos();
  });

  group('Endpoint Editar Produtos - Serverest.Api', () => {
    EditarProdutos();
  });

  group('Endpoint Listar Produtos - Serverest.Api', () => {
    ListarProdutos();
  });

  group('Endpoint Listar produtos por id - Serverest.Api', () => {
    ListarProdutosId();
  });

  group('Endpoint Excluir Produtos - Serverest.Api', () => {
    ExcluirProdutos();
  });

  sleep(1);
}