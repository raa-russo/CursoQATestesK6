import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { check, fail } from 'k6';

export let GetCustomerDuration = new Trend('get_customer_duration');
export let GetCustomerFailRate = new Rate('get_customer_fail_rate');
export let GetCustomerSuccessRate = new Rate('get_customer_success_rate');
export let GetCustomerReqs = new Rate('get_customer_reqs');

export default function () {
  let res = http.get('http://localhost:3000/usuarios')

  GetCustomerDuration.add(res.timings.duration);
  GetCustomerReqs.add(1);
  GetCustomerFailRate.add(res.status == 0 || res.status > 399);
  GetCustomerSuccessRate.add(res.status < 399);

  let durationMSG = 'Max Duration ${1000/1000}s'
  if(!check(res, {
    'max duration': (r) => r.timings.duration < 5000,
    'is status code 200': (r) => r.status === 200,
  })){
    fail(durationMSG);
  }

   // Analisar a resposta JSON e extrair o _id do usuário
  //  const usuario = JSON.parse(res.body);
  //  const idUsuario = usuario.json()._id;
 
   // const token = res.json().authorization.slice(7);
   // globalThis.token = token
 
  //  console.log("ID do usuário:", idUsuario);
  
  sleep(1);
}

