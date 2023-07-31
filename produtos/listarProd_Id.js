import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { check, fail } from 'k6';
import ID_Prod from "./cadastrarProd.js";

export let GetCustomerFailRate = new Rate('get_customer_fail_rate');
export let GetCustomerSuccessRate = new Rate('get_customer_success_rate');
export let GetCustomerReqs = new Rate('get_customer_reqs');

export default function () {
  ID_Prod();
  let res = http.get(`http://localhost:3000/produtos/${globalThis.id}`)
  
  GetCustomerReqs.add(1);
  GetCustomerFailRate.add(res.status == 0 || res.status > 399);
  GetCustomerSuccessRate.add(res.status < 399);

  check(res, {    
    'is status code 200': (r) => r.status === 200,
  });
  

  //console.log(res.body);
  sleep(1);
}

