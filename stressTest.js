import http from "k6/http";
import { sleep } from "k6";

const baseUrl = "http://localhost:3000"; // URL base da sua aplicação
const maxUsers = 100; // Número máximo de usuários virtuais simultâneos
const testDuration = "1m"; // Duração do teste de estresse (1 minuto)

export const options = {
  stages: [
    { duration: "30s", target: maxUsers }, // Aumenta gradativamente para o número máximo de usuários em 30 segundos
    { duration: "30s", target: maxUsers }, // Mantém o número máximo de usuários por mais 30 segundos
    { duration: "10s", target: 0 }, // Reduz gradualmente o número de usuários para 0 em 10 segundos
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // Define o limite de 500 ms para a duração das requisições
  },
};

export default function () {
  // Simula uma requisição GET para a página inicial da aplicação
  http.get(`${baseUrl}`);

  // Aguarda um pequeno intervalo entre as requisições
  sleep(1);
}
