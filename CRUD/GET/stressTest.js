import http from "k6/http";
import { sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

const baseUrl = "http://localhost:3000"; // URL base da sua aplicação
const maxUsers = 10; // Número máximo de usuários virtuais simultâneos
const testDuration = "1m"; // Duração do teste de estresse (1 minuto)

export const options = {
  stages: [
    { duration: "2s", target: maxUsers }, // Aumenta gradativamente para o número máximo de usuários em 30 segundos
    { duration: "3s", target: maxUsers }, // Mantém o número máximo de usuários por mais 30 segundos
    { duration: "1s", target: 0 }, // Reduz gradualmente o número de usuários para 0 em 10 segundos
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // Define o limite de 500 ms para a duração das requisições
  },
};

export default function () {
  // Simula uma requisição GET para a página inicial da aplicação
  const response = http.get(`${baseUrl}`);

  try {
    // Verifica se a resposta foi bem-sucedida (status 2xx)
    if (response.status >= 200 && response.status < 300) {
      console.log('Stress Test passou! API is up and running.');
    } else {
      console.error('Stress Test falhou! API returned an error.');
    }
  } catch (error) {
    console.error('Stress Test falhou! Unable to connect to the API.');
    console.error(error.message);
  }

  // Aguarda um pequeno intervalo entre as requisições
  sleep(1);
}
