import Login from "../login/login.js";
import ListarUsuarios from "./listarUsers.js";
import CadastrarUsuarios from "./cadastrarUsers.js";
import ListarUsuariosId from "./listarUsersId.js";
import EditarUsuarios from "./editarUsers.js";
import ExcluirUsuarios from "./excluirUsers.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  stages: [
    { duration: "1m", target: 100 },
    { duration: "2m", target: 100 },
    { duration: "1m", target: 0 },

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

  group('Endpoint Editar usuários - Serverest.Api', () => {
    EditarUsuarios();
  });

  group('Endpoint Cadastrar Usuário - Serverest.Api', () => {
    CadastrarUsuarios();
  });

  group('Endpoint Listar Usuarios por id - Serverest.Api', () => {
    ListarUsuariosId();
  });

  group('Endpoint Excluir Usuários - Serverest.Api', () => {
    ExcluirUsuarios();
  });

  sleep(1);
}