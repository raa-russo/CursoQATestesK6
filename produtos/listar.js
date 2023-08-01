import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import { check, fail } from 'k6';

export let GetCustomerFailRate = new Rate('get_customer_fail_rate');
export let GetCustomerSuccessRate = new Rate('get_customer_success_rate');
export let GetCustomerReqs = new Rate('get_customer_reqs');

export default function () {
  let res = http.get('http://localhost:3000/produtos')
  
  GetCustomerReqs.add(1);
  GetCustomerFailRate.add(res.status == 0 || res.status > 399);
  GetCustomerSuccessRate.add(res.status < 399);

  
  check(res, {
    'max duration': (r) => r.timings.duration < 5000,
    'is status code 200': (r) => r.status === 200,
  })
  //console.log(res.body);
  sleep(1);
}

//run test =>  k6 run produtos/listar.js