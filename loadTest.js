import http from "k6/http";
import { check, sleep, group } from "k6";

const baseUrl = "http://localhost:3000"; // URL base da Serverest
const numberOfUsers = 10; // Número de usuários virtuais simulados
const testDuration = "30s"; // Duração do teste de carga

export const options = {
  vus: numberOfUsers,
  duration: testDuration,
};

export default function () {
  group("Smoke Test", function () {
    const userId = __VU; // Obtém o ID do usuário virtual
    const endpoint = "/usuarios/" + userId;

    // Faz uma requisição GET para um endpoint da API Serverest
    const response = http.get(`${baseUrl}${endpoint}`);

    // Verifica se a resposta foi bem-sucedida (status 2xx)
    check(response, {
      "Status is 200": (r) => r.status === 200,
    });

    // Aguarda um pequeno intervalo entre as requisições
    sleep(1);
  });
}
