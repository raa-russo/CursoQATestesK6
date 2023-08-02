[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)
# Nessa Sprint 06 estudaremos:
* Primeiro contato com K6
* Thresholds
* Validações com K6
* K6 CLI

## O que estudaremos?
* Fazendo uso dos conhecimento adquiridos sobre o K6 e do planejamento de testes voltados para a performance da aplicação ServeRest criados nas Sprints anteriores, criem os scripts do K6 com o foco nas rotas /usuarios, /login e /produtos. Dividam os testes em duas categorias:
testes individuais das rotas  (por exemplo, criar um usuário, realizar login, etc)
testes que envolvam fluxos mais abrangente (exemplo: criar um usuário, realizar login com o usuário e criar um produto, tudo dentro do mesmo fluxo).
* Não se esqueçam de fazer uso do controle de métricas e thresholds conforme planejado na sprint anterior dentro dos seus scripts de testes.

## O que será considerado na avaliação?
* Cenários criados (se fazem sentido, estão fáceis de ler, etc);
* Cobertura atingida dentro dos cenários propostos (proposto vs atingido);
* Qualidade do código criado para os scripts K6;
* Report gerado com as execuções dos testes;
* Organização do plano de testes;
* Organização do projeto com os scritps de testes do K6;
* Uso dos conteúdos aprendidos na Sprint nos scripts do K6 (ex: thresholds, options, etc);

# Tipos de Teste Performance usando o K6:
* Os principais tipos são os seguintes. Cada tipo tem seu próprio artigo descrevendo seus conceitos essenciais:
* Os testes de fumaça (smoke test) validam que seu script funciona e que o sistema funciona adequadamente sob carga mínima.
* O teste de carga média (load test)avalia o desempenho do seu sistema em condições normais esperadas.
* Os testes de estresse(stress test) avaliam como um sistema funciona em seus limites quando a carga excede a média esperada.
* Os testes de imersão avaliam a confiabilidade e o desempenho do seu sistema por períodos prolongados.
* Os testes de pico validam o comportamento e a sobrevivência do seu sistema em casos de aumentos súbitos, curtos e massivos na atividade.
* Os testes de breakpoint aumentam gradualmente a carga para identificar os limites de capacidade do sistema.

# Métricas
* As métricas medem o desempenho de um sistema em condições de teste. Por padrão, o k6 coleta automaticamente as métricas integradas. Além dos integrados, você também pode criar métricas personalizadas.

## As métricas se enquadram em quatro tipos amplos:
* Counters sum values. => Contadores somam valores.
* Gauges track the smallest, largest, and latest values.=> Os medidores rastreiam os valores menores, maiores e mais recentes.
* Rates track how frequently a non-zero value occurs.=> As taxas rastreiam a frequência com que um valor diferente de zero ocorre.
* Trends calculates statistics for multiple values (like mean, mode or percentile).=> O Trends calcula estatísticas para vários valores (como média, moda ou percentil).   
![pmetricas.jpg](/uploads/e24e7dd710cd22158f7cbce98e7ca8b4/pmetricas.jpg)

* Para fazer um teste falhar em determinados critérios, você pode escrever um Limite com base nos critérios da métrica (as especificidades da expressão dependem do tipo de métrica). Para filtrar métricas, você pode usar Tags e grupos . Você também pode exportar métricas em vários formatos resumidos e granulares, conforme documentado em Resultados de saída .

# Quando usar um ou outro tipo de teste
* A tabela a seguir fornece algumas comparações amplas.

![k6.jpg](/uploads/427981667c0aec809d61bd3333963f5c/k6.jpg)


## APi Serverest rodando localmente
* localhost, na porta 3000.

## Requisitos Funcionais:

* Autenticação:
- [X] Deve retornar os id ao cadastrar um novo usuario
- [X] Deve retornar 201 ao cadastrar um novo usuario
- [X] Deve retornar 400 ao tentar cadastrar sem email
- [X] Deve retornar 400 se o email for duplicado

| campos     |  Descricao                                     | TIPO      | Obrigatório                   |  
| :-----     |  :-------------------------------------------  | :-------- | :-----------------------------|   
| email:     |  usuário identificador único                   | email     | sim                           |
| password   |  senha do usuário                              | texto     | sim                           |

## Requisitos Não Funcionais:

* Autenticação:
- [X] O cadastro com sucesso deve ocorrer em até 2 segundos
- [X] Deve poder cadastar ate 100 usuario simultaneos
- [X] A margem de erro deve ser pelo menos 1%
- [X] Cadastros sem sucesso devem ocorrer em ate 2 segundos

## Tecnologias

- [Node.js] - plataforma de desenvolvimento 
- [K6] - ferramenta para teste de carga, performance, stress, etc... 

## Podemos obter os resultados por [HTML]  
* bastando importar: 'import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"';
* depois exportar: 
export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }


# Para pegar o token de Authorization:
const token = res.json().authorization;  //pegando token e guardando numa variavel
    globalThis.token = token  //add o token numa variavel global       
    console.log(token     //mostrando token na tela   

* Conferir se tem token narequisicao com um check de resposta.   
check(res, {          
        'response should have token': (r) => r.json().hasOwnProperty('authorization'),   
    });    

# Para pegar o id do usuario e tbm do produto
* Sera usado o mesmo script, no corpo do header temos que usar o seguinte script:  
* Esta para criar um produto, usando o token.   
const Headers = {   
    headers: {   
      'Content-Type': 'application/json',   
      'Authorization': `${globalThis.token}`, // Adicionando o token no header de autorização   
    },    
  };    

* Para listar por id ou excluir precisamos incluir o id.  
 IDUsers(); //chamamos a variavel id, e logo apos incluimos ela na requisicao.   
  let res = http.get(`http://localhost:3000/usuarios/${globalThis.id}`)

# Importando Token para poder usar nos scripts e importando a do id.    
import Token from "./login.js";  
import IDUsers from "./cadastrarUsers.js";

# Importando Controler
* modelo: import GetAllProducts from "./GET/get_all_products.js";

# Usando options:
* para uma unica controller:

export const options = {   
    stages: [   
    { "duration":"5s", "target": 10 },   
    { "duration":"5s", "target": 0 },   
    ],   
  }   

  * para mais de uma controller:
  export const options = {   
    primeiro-projeto: {  
      tests_k6: {  
        GET: {  
          get_all_users: {  
            executor: 'constant-vus',  
            exec: 'contacts',  
            vus: 50,  
            duration: '30s',  
          },  
          get_all_products: {  
            executor: 'constant-vus',  
            exec: 'contacts',  
            vus: 50,  
            iterations: 100,  
            startTime: '30s',  
            maxDuration: '1m',  
          },  
          get_all_carrinhos: {  
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
  };  
  * Depois temos que chamar as funcoes declaradas acima e passamos os groups:   

  export function get_all_users() {    
    group('Endpoint Get get_all_users - APi K6', () => {     
    });    
  }   
  export function get_all_products() {    
    group('Endpoint Get get_all_products - APi K6', () => {     
    });    
  }      
* fazer isso para todos os grupos.

  ### Para ver as respotas no corpo do teste:
  * console.log(res.body)
  * console.log(id)  

  # Verbo Post
  * para criar usuarios randomicamente temos que usar o uuid
  * primeiro temos que instalar o pacote node no nosso projeto "npm install uuid@3.4.0"
  * o browserify transforma o node em javascript puro. "npm install browserify" e depois "npx browserify node_modules/uuid/index.js -s uuid > uuid.js"

# Instalando uuid de masssa de teste dinamica

gitbash
//npm install uuid@3.4.0  
//npm install browserify  
//npx browserify node_modules/uuid/index.js -s uuid > uuid.js  
//apagar a pasta node modules  
//apagar os arquivos package.jason e  package-lock.jason  
// mover o arquivo uuid.js para uma pasta de libs do repositório  
// importar para o projeto com: import uuid from './libs/uuid.js'  
// chamando a função `${uuid.v4()}`  

## Resumo passo a passo:

* Iniciando o projeto, para isso é precisar instalar o chocolatey, depois instalar o k6, para isso bastar dar um "choco install k6". No power shell.
* Feito isso inicialize o projeto ja dentro da pasta dando um "npm init -y".  E logo apos dar um npm install k6.
* para facilitar o caminho para rodar meus testes deixarei salvo aqui o comando.."k6 run primeiro-projeto/tests_k6/CRUD/GET//limites.js"
* para colocar mais usuarios e tbm o tempo de duração, basta apos o nome add "--vus 20 --duration 60s". Onde 20 é a quantidade de usuarios e 60 o tempo em milessegundos.
* para rodar o arquivo da rampa de tempo e usuarios basta add. --config settings/settings.json no final da chamada. ex:  k6 run primeiro-projeto/tests_k6/index.js --config settings/settings.json
* rodar chamando por script e passando qtt. "k6 run primeiro-projeto/tests_k6/index.js --vus 20 --duration 10s"

# excluir usuarios
  (npx clear-npx-cache)
  




  
  
  

  


