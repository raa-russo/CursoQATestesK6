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

    // Verifica se a resposta foi bem-sucedida (status 200)
    check(res, {
      "Status é 200": (r) => r.status === 200,
    });    
    //console.log(res.body)
    // Aguarda um pequeno intervalo entre as requisições
    sleep(1);
  }





   
    
    

