import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }  

export default function () {
    const url = 'http://localhost:3000/login';

    const payload = JSON.stringify({
        email: 'fulano@qa.com',
        password: 'teste'
    })
    const headers = { 'headers': { 'Content-Type': 'application/json' } }
    const res = http.post(url, payload, headers) 
  
    check(res, {
        'status should be 200': (r) => r.status === 200,        
    });       
    //console.log(res.body);
    sleep(1);
}




