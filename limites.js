import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  thresholds: {
    // 90% of requests must finish within 400ms, 95% within 800, and 99.9% within 2s.
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
  },
};

export default function () {
  const res1 = http.get('http://localhost:3000');
  sleep(1);
}


//correndo um teste com 100 usuarios fazendo requisicoes por 30s
