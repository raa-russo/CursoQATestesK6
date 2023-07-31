import http from 'k6/http';
import { sleep, check } from 'k6';
import IDUsers from "./cadastrarUsers.js";


export default function () {
    IDUsers();
    const url = `http://localhost:3000/usuarios/${globalThis.id}`;

    const payload = JSON.stringify({
        nome: 'russo',
        email: 'rogerio@qa.com',
        password: 'teste',
        administrador: 'true'
    })

    const headers = { 'headers': { 
        'Content-Type': 'application/json',
        'monitor': 'false',
     } }

    const res = http.put(url, payload, headers)

    check(res, {
        'status shoul be 200': (r) => r.status === 200,       
    });
    
    //console.log(res.body)
    //console.log(id)

    sleep(1)
}
