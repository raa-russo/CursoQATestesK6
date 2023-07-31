import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import uuid from '../libs/uuid.js'

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'] //95% das requisiçoes devem responder em ate 2s.
  }
}

export default function () {
  const url = 'http://localhost:3000/usuarios';

const payload = JSON.stringify ({ 
  nome: `${uuid.v4()}`, 
  email: `${uuid.v4().substring(24)}@qa.com`, 
  password: 'teste', 
  administrador: 'true' 
})

const headers = { 'headers': { 'Content-Type': 'application/json' } }
  
const res = http.post(url, payload, headers)

  check(res, {
    'status shoul be 201': (r) => r.status === 201,
        
  });
  
  console.log(res.body)
  sleep(1)
}
