import http from "k6/http";
import { sleep, check } from "k6";

const baseUrl = "http://localhost:3000"; // URL base da Serverest
const maxUsers = 50; // Número máximo de usuários virtuais simultâneos
const soakTestDuration = "5m"; // Duração do teste de soak (5 minutos)

export const options = {
  stages: [
    { duration: "1m", target: maxUsers }, // Aumenta gradativamente para o número máximo de usuários em 1 minuto
    { duration: soakTestDuration, target: maxUsers }, // Mantém o número máximo de usuários pelo tempo especificado
    { duration: "1m", target: 0 }, // Reduz gradualmente o número de usuários para 0 em 1 minuto
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
