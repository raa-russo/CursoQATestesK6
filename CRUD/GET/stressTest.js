import http from "k6/http";
import { sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

const baseUrl = "http://localhost:3000"; // URL base da sua aplicação

export const options = {
  stages: [
    { duration: "2s", target: 100 },
    { duration: "3s", target: 100 }, 
    { duration: "2s", target: 200 }, 
    { duration: "3s", target: 200 }, 
    { duration: "1s", target: 300 }, 
    { duration: "2s", target: 300 }, 
    { duration: "3s", target: 400 }, 
    { duration: "1s", target: 0 }, 
  ],
  thresholds: {
    http_req_duration: ["p(95)<5000"], 
    http_req_failed: ['rate<0.01']
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
  check(response, {
    "Status é 200": (r) => r.status === 200,
  });
  console.log(response.body)
  // Aguarda um pequeno intervalo entre as requisições
  sleep(1);
}
