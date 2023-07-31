import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], //95% das requisiçoes devem responder em ate 2s.
    http_req_failed: ['rate<0.01'] //1% das reuisicoes podem ocorrer erro.
  }
}

export default function () {
  const url = 'http://localhost:3000/login';

const payload = JSON.stringify ({ email: 'fulano@qa.com', password: 'teste' })

const headers = { 'headers': { 'Content-Type': 'application/json' } }
  
const res = http.post(url, payload, headers)

  check(res, {
    'status shoul be 200': (r) => r.status === 200,
        
  });  
  
  sleep(1)
}
