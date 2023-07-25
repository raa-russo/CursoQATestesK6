import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const res = http.get('http://localhost:3000');
  check(res, {
    'body size is 3237 bytes': (r) => r.body.length == 3237,
    'is status 200': (r) => r.status === 200,
  });
  console.log(res.body.length);
}
