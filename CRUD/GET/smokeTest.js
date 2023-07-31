import http from "k6/http";
import { check, sleep, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export default function () {
  const res = http.get('http://localhost:3000'); 

    try {  

        // Verifica se a resposta foi bem-sucedida (status 2xx)
        if (res.status >= 200 && res.status < 300) {
          console.log('Smoke Test passou! API is up and running.');
        } else {
          console.error('Smoke Test falhou! API returned an error.');
        }
      } catch (error) {
        console.error('Smoke Test falhou! Unable to connect to the API.');
        console.error(error.message);
      }

    // Verifica se a resposta foi bem-sucedida (status 2xx)
    check(res, {
      "Status é 200": (r) => r.status === 200,
    });    

    // Aguarda um pequeno intervalo entre as requisições
    sleep(1);
  }





   
    
    

