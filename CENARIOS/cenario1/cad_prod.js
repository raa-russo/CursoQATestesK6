import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { check, fail } from 'k6';
import uuid from '../uuid.js';
import Token from "./login.js";

export let GetCustomerDuration = new Trend('post_customer_duration');
export let GetCustomerFailRate = new Rate('post_customer_fail_rate');
export let GetCustomerSuccessRate = new Rate('post_customer_success_rate');
export let GetCustomerReqs = new Rate('post_customer_reqs');

export default function () {
  const url = 'http://localhost:3000/produtos';

  Token();  
    
  const payload = JSON.stringify ({ 
      nome: `${uuid.v4()}`, 
      preco: 10, 
      descricao: 'teste', 
      quantidade: 5
  })
  
  const Headers = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${globalThis.token}`, // Adicionando o token no header de autorização
    },
  };
  
  const res = http.post(url, payload, Headers);
  
    check(res, {
      'status should be 201 - created product!': (r) => r.status === 201,
    });

  GetCustomerDuration.add(res.timings.duration);
  GetCustomerReqs.add(1);
  GetCustomerFailRate.add(res.status == 0 || res.status > 399);
  GetCustomerSuccessRate.add(res.status < 399);

  let durationMSG = 'Max Duration ${1000/1000}s'
  if(!check(res, {
    'max duration': (r) => r.timings.duration < 5000,
    
  })){
    fail(durationMSG);
  }  
  console.log(res.body);
  sleep(1);
  
}


