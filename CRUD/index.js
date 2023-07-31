import Produtos from "./GET/get_all_users.js";
import Usuarios from "./GET/get_all_products.js";  
//import Resposta from "./GET/get_all_carrinhos.js";
import { group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }
  
export const options = {   
  primeiro_projeto: {  
    tests_k6: {  
      GET: { 
        CRUD: {
          Usuarios: {  
            executor: 'constant-vus',  
            exec: 'contacts',  
            vus: 50,  
            duration: '30s',  
          },            
          Produtos: {  
            executor: 'constant-vus',  
            exec: 'contacts',  
            vus: 50,  
            iterations: 100,  
            startTime: '30s',  
            maxDuration: '1m',  
          },
        },        
      },  
    },  
  },     
};  

export function Usuarios() {    
  group('Endpoint Usuarios - APi K6', () => {     
  });    
}   
export function Produtos() {    
  group('Endpoint Produtos - APi K6', () => {     
  });    
}  