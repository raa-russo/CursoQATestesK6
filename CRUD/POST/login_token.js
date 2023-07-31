import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
    const url = 'http://localhost:3000/login';

    const payload = JSON.stringify ({ 
      email: 'fulano@qa.com', 
      password: 'teste' 
    })

    const headers = { 'headers': { 'Content-Type': 'application/json' } }
    const res = http.post(url, payload, headers)    

    check(res, {
        'status shoul be 200': (r) => r.status === 200,    
        'response should have token': (r) => r.json().hasOwnProperty('authorization'),
  });  

  const token = res.json().authorization.slice(7);
  globalThis.token = token

  console.log(token)
  
  sleep(1);
}
