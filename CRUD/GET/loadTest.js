import http from "k6/http";
import { check, sleep, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

const baseUrl = "http://localhost:3000"; // URL base da Serverest

export const options = {
  stages: [
    { duration: "1m", target: 100 }, // Aumenta gradativamente para o número máximo de usuários em 30 segundos
    { duration: "2m", target: 100 }, // Mantém o número máximo de usuários por mais 30 segundos
    { duration: "1m", target: 0 }, // Reduz gradualmente o número de usuários para 0 em 10 segundos
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // Define o limite de 500 ms para a duração das requisições
    http_req_failed: ['rate<0.01'] //1% das requisicoes podem falhar
  },
};

export default function () {
  group("loadTest", function () {
    const endpoint = "/usuarios/";
    // Faz uma requisição GET para um endpoint da API Serverest
    const response = http.get(`${baseUrl}${endpoint}`);
    try {  
      // Verifica se a resposta foi bem-sucedida (status 2xx)
      if (response.status >= 200 && response.status < 300) {
      //  console.log('Load Test passou! API is up and running.');
      } else {
      //  console.error('Load Test falhou! API returned an error.');
      }
    } catch (error) {
    //  console.error('Load Test falhou! Unable to connect to the API.');
    //  console.error(error.message);
    }

    // Verifica se a resposta foi bem-sucedida (status 2xx)
    check(response, {
      "Status é 200": (r) => r.status === 200,
    });

    // Aguarda um pequeno intervalo entre as requisições
    sleep(1);
  });
}
