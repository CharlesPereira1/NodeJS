const express = require('express');

const server = express();

server.use(express.json());

let cont = 0;

/**
 *  MIDDLEWIRE
 */

//função para verificação projeto
function  checkidExists(req, res, next) {
  const { id } = req.params;
  const projectID = projects.find(p => p.id == id);

  if (!projectID) {
    return res.status(400).json({error: "Project does not exists!"});
  }

  return next()
}

//Função global para contagem de requisições
function contRequest(req, res, next) {
  cont++;

  console.log(`Contagem de requisições: ${cont}.`);
  
  return next();
}

server.use(contRequest);

/**
 *  CRUD - PROJETOS
 */

const projects = [];

//Listar todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Lista de um projeto pelo ID
server.get('/projects/:id', checkidExists, (req, res) => {
  const { id }  = req.params;
  const project = projects.find(p => p.id == id);

  return res.json(project)
});

//Criar projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: [],
  };

  projects.push(project);

  return res.json(project);
});

// Cadastrar Tasks - Tarefas
server.post('/projects/:id/tasks', checkidExists, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  const projectID = projects.find(p => p.id == id);

  projectID.tasks.push(tasks);

  return res.json(projectID);
});

//Editar projeto
server.put('/projects/:id',checkidExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectID = projects.find(p => p.id == id);

  projectID.title = title;

  return res.json(projectID);

});

//Deletar Projeto
server.delete('/projects/:id', checkidExists, (req, res) => {
  const { id } = req.params;

  const projectID = projects.find(p => p.id == id);
  
  projects.splice(projectID, 1);

  return res.json(projectID);

});

server.listen(3000);


