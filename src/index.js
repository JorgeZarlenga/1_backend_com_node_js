const express = require('express');
const {uuid, isUuid} = require('uuidv4'); // Universal Unique ID

const app = express();

app.use(express.json())

/*
Métodos HTTP:

GET - app.get - Buscar informações do back-end
POST - Criar informação no back-end
PUT (atualizando informação por completo. Ex: Perfil de usuário)/PATCH (atualiza informação específica, como foto de avatar) - Alterar uma informação no back-end
DELETE - Deleta uma informação no back-end
*/

/*
Tipos de parâmetros (formas do front end enviar informações):

3 principais:

- Query Params: Filtros e paginação
- Route Params: Identificar recursos ao autalizar (PUT) ou deletar (DELETE)
- Request Body: Conteúdo na hora de criar ou editar um recurso (JSON) (informações de formulário, por exemplo)
*/

/*
Middleware:
 Interceptador de requisições que pode interromper totalmente a requisição ou alterar dados da requisição
 - Usado quando se deseja que determinado trecho de código seja disparado de forma automática em uma ou mais rotas da aplicação
 - Ou quando se deseja ver se o formato está no formato correto
*/


const projects = []; // Armazenando a variável na memória da aplicação (volátil - NÃO UTILIZAR EM PRODUÇÃO)

// Middleware (todas as rotas podem ser consideradas middlewares por reeberem request e reponse)

function logRequests(request, response, next){ 
    const {method, url} = request; // Método (Get, post...)

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    //console.log(logLabel);

    console.time(logLabel); // Retorna tempo

    next(); // Chamada do próximo middleware (fluxo da aplicação é linear)

    console.timeEnd(logLabel);

    // Aqui (passo 3)
}

function validateProjectId (request, response, next){
    const {id} = request.params;

    if(!isUuid(id))
    {
        return response.status(400).json({error: 'Invalid project ID.'});
    }

    // Tudo que vem depois não é executado, mas é preciso usar o return:

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId) // Aplicar apenas às rotas que têm esse formato

app.get('/projects', logRequests, (request, response) => { // projects - recurso. Arrow function. Request guarda as informações da requisição


    const {title} = request.query; // Contém os parâmetros
    
    // Verificação ternária:
    const results = title // Verificando se o título foi preenchido pelo usuário
    ? projects.filter(project => project.title.includes(title)) // Verifica se title está contido dentro do project.title
    : projects;
    /*
    const query = request.query; // Contém os parâmetros

    console.log(query);

    ou:
    */

//    const {title, owner} = request.query; // Contém os parâmetros

//    console.log(title);
//    console.log(owner);

   /*
    return response.json([
        'Projeto 1',
        'Projeto 2'
    ]);

    ou, com o array de projetos:
    */

   return response.json(results);
});
 



app.post('/projects', (request, response) => {
    
    /*
    const body = request.body;

    console.log(body);

    ou
    */

   const {title, owner} = request.body;

   const project = { id: uuid(), title, owner};

   projects.push(project); // Adiciona o projeto ao final do array

   return response.json(project);

   /*
   console.log(title);
   console.log(owner);

    return response.json([
        'Projeto 1',
        'Projeto 2',
        'Projeto 3'
    ]);
    */
});

// Aplicando middleware
app.put('/projects/:id', (request, response) => {
        
    /*
    const params = request.params;

    console.log(params);

    ou
    */

   const { id } = request.params;
   const {title, owner} = request.body;

   const projectIndex = projects.findIndex(project => project.id === id); // Função do Javascript para localizar no array (posição do objeto no vetor)

   if(projectIndex < 0) {
       return response.status(400).json({error: 'Project not found.'}) // Status de código genérico para erro no back-end
   }

   const project = {
       id,
       title,
       owner
   };

   projects[projectIndex] = project; // Substituindo o valor na posição

   // Retornando o projeto atualizado (não a lista completa):
   return response.json(project);
   /*
   console.log(id);

    return response.json([
        'Projeto 4',
        'Projeto 2',
        'Projeto 3'
    ]);

    */
});

app.delete('/projects/:id', (request, response) => {

    const {id} = request.params;

    const projectIndex = projects.findIndex(project => project.id === id); // Função do Javascript para localizar no array (posição do objeto no vetor)

   if(projectIndex < 0) {
       return response.status(400).json({error: 'Project not found.'}) // Status de código genérico para erro no back-end
   }
   
   // Caso exista:
   projects.splice(projectIndex, 1) // Retira informação de um array (indice e quantas posições remover a partir do índice)

   return response.status(204).send(); // Retornando vazio (recomendado usar o status 204)

   /*
    return response.json([
        'Projeto 2',
        'Projeto 3'
    ]);

    */
});


/*
app.get('/', (request, response) => { // Arrow function. Request guarda as informações da requisição
    return response.send('Hello World');
});
*/

app.listen(3333, () => {
    console.log('Back-end started!')
});