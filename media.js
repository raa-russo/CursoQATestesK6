import http from 'k6/http';
import { group, sleep } from 'k6';

export const options = {
  thresholds: {
    'group_duration{group:::individualRequests}': ['avg < 400'],
    'group_duration{group:::batchRequests}': ['avg < 200'],
  },
  vus: 10,
  duration: '10s',
};

export default function () {
  group('individualRequests', function () {
    http.get('http://localhost:3000');
    http.get('http://localhost:3000/usuarios');
    http.get('http://localhost:3000/produtos');
  });

  group('batchRequests', function () {
    http.batch([
      ['GET', `http://localhost:3000`],
      ['GET', `http://localhost:3000/usuarios`],
      ['GET', `http://localhost:3000/produtos`],
    ]);
  });

  sleep(1);
}
