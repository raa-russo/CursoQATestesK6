import http from "k6/http";
import { check, sleep, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

const baseUrl = "http://localhost:3000"; // URL base da Serverest
const numberOfUsers = 10; // Número de usuários virtuais simulados
const testDuration = "5s"; // Duração do teste de carga

export const options = {
  vus: numberOfUsers,
  duration: testDuration,
};

export default function () {
  group("SmokeTest", function () {
    const endpoint = "/usuarios/";

    // Faz uma requisição GET para um endpoint da API Serverest
    const response = http.get(`${baseUrl}${endpoint}`);

    try {  

        // Verifica se a resposta foi bem-sucedida (status 2xx)
        if (response.status >= 200 && response.status < 300) {
          console.log('Smoke Test passou! API is up and running.');
        } else {
          console.error('Smoke Test falhou! API returned an error.');
        }
      } catch (error) {
        console.error('Smoke Test falhou! Unable to connect to the API.');
        //console.error(error.message);
      }

    // Verifica se a resposta foi bem-sucedida (status 2xx)
    check(response, {
      "Status é 200": (r) => r.status === 200,
    });    

    // Aguarda um pequeno intervalo entre as requisições
    sleep(1);
  });
}




   
    
    

