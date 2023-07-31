import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
  const url = 'http://localhost:3000/login';

const payload = JSON.stringify ({ email: 'fulano@qa.com', password: 'teste' })

const headers = { 'headers': { 'Content-Type': 'application/json' } }
  
const res = http.post(url, payload, headers)

console.log("response:", JSON.parse(res.body).Authorization)

  check(res, {
    'status shoul be 200': (r) => r.status === 200,
        
  });
  
  console.log(res.body)
  sleep(1)
}
