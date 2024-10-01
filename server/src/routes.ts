import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './database/connection';

const jwtSecretKey = 'dsfdsfsdfdsvcsvdfgefg';

const routes = express.Router();

routes.get('/', (_req, res) => {
  res.send('Auth API.\nPlease use POST /auth & POST /verify for authentication');
});

interface User {
  id: Number,
  full_name: string,
  email: string;
  birthdate: string,
  pass: string,
  xp: number,
  level: string
}

interface FirstTask {
  id: Number,
  user_id: Number,
  initial_quests: string,
  id_atual_task: Number
}

//#region Autenticador
// The auth endpoint that creates a new user record or logs a user based on an existing record
routes.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look up the user entry in the database
    const user: User = await db('users_login')
      .where({ email: email })
      .first();

    // If found, compare the hashed passwords and generate the JWT token for the user
    if (user) {
      const match = await bcrypt.compare(password, user.pass);
      if (!match) {
        return res.status(401).json({ message: 'Invalid password' });
      } else {
        const loginData = {
          email,
          signInTime: Date.now(),
        };

        const token = jwt.sign(loginData, jwtSecretKey);
        const userId = user.id;
        const userFullName = user.full_name;

        res.status(200).json({ message: 'success', token, id: userId, fullName: userFullName });
      }
    } else {
      // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      await db('users_login').insert({ email: email, pass: hashedPassword });

      const loginData = {
        email,
        signInTime: Date.now(),
      };

      const token = jwt.sign(loginData, jwtSecretKey);
      res.status(200).json({ message: 'success', token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// The verify endpoint that checks if a given JWT token is valid
routes.post('/verify', (req, res) => {
  const tokenHeaderKey = 'jwt-token';
  const authToken = req.headers[tokenHeaderKey] as string | undefined;

  if (!authToken) {
    return res.status(401).json({ status: 'invalid auth', message: 'Token not provided' });
  }

  try {
    const verified = jwt.verify(authToken, jwtSecretKey);
    if (verified) {
      return res.status(200).json({ status: 'logged in', message: 'success' });
    } else {
      // Access Denied
      return res.status(401).json({ status: 'invalid auth', message: 'error' });
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ status: 'invalid auth', message: 'error' });
  }
});

// An endpoint to see if there's an existing account for a given email address
routes.post('/check-account', async (req, res) => {
  const { email } = req.body;

  console.log(req.body);

  // Look up the user entry in the database
  const user = await db('users_login')
    .where({ email: email })
    .first();

  // Check if user exists
  const userExists = user !== undefined;

  res.status(200).json({
    status: userExists ? 'User exists' : 'User does not exist',
    userExists,
  });
});

// Novo endpoint para registro de usuário
routes.post('/register', async (req, res) => {
  const { full_name, email, birthdate, password } = req.body;

  // Verifica se o email já está cadastrado
  const existingUser = await db('users_login').where({ email }).first();

  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insere o novo usuário no banco de dados
  try {
    const [userId] = await db('users_login').insert({
      full_name,
      email,
      birthdate,
      pass: hashedPassword,
    }).returning('id');

    // Gera um token JWT para o usuário
    const token = jwt.sign({ email, userId }, jwtSecretKey, { expiresIn: '1h' });

    return res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
    return res.status(500).json({ message: 'Unknown error registering user' });
  }
});

//#endregion Autenticador

//#region Task inicial
// Endpoint para registrar task inicial
routes.post('/register-first-task', async (req, res) => {
  const { id } = req.body;

  // Insere o novo usuário no banco de dados
  try {
    await db('users_tasks').insert({
      user_id: id,
      initial_quests: 'S',
      id_atual_task: 0
    });

    return res.status(201).json({ message: 'Primeira tarefa registrada com sucesso' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Erro ao registrar a primeira tarefa do usuário: ', error: error.message });
    }
    return res.status(500).json({ message: 'Erro desconhecido ao registrar a primeira tarefa do usuario' });
  }
});

// Endpoint para identificar se o usuário já passou da primeira etapa
routes.post('/verify-first-task', async (req, res) => {
  const { id } = req.body;

  try {

    const existingTask: FirstTask = await db('users_tasks').where({ user_id: id }).first();

    if (existingTask && existingTask.initial_quests == 'S') {
      return res.status(400).json({ message: 'Ja passou pela primeira etapa' });
    }

    return res.status(201).json({ message: 'Primeiro acesso' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Erro ao verificar a primeira tarefa do usuário: ', error: error.message });
    }
    return res.status(500).json({ message: 'Erro desconhecido ao verificar a primeira tarefa do usuario' });
  }
});

// Endpoint para remover se o usuário já passou da primeira etapa
routes.post('/remove-first-task', async (req, res) => {
  const { id } = req.body;

  try {
    await db('users_tasks').delete().where({ user_id: id });

    return res.status(201).json({ message: 'Primeiro acesso removido' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Erro ao remover a primeira tarefa do usuário: ', error: error.message });
    }
    return res.status(500).json({ message: 'Erro desconhecido ao remover a primeira tarefa do usuario' });
  }
});
//#endregion

//#region Perguntas
// Endpoint para registrar novas perguntas
routes.post('/register-question', async (req, res) => {
  const { question_text, question_id, type, options, correct_answer, difficulty, xp_reward } = req.body;

  try {
    // Certifique-se de que 'options' é um objeto JSON se não for stringificado automaticamente
    const optionsToSave = typeof options === 'string' ? JSON.parse(options) : options;

    await db('questions').insert({ 
      question_text, 
      question_id,
      type, 
      options: optionsToSave, // Armazena como JSON
      correct_answer, 
      difficulty, 
      xp_reward
    });

    return res.status(201).json({ message: 'Questão registrada com sucesso' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Erro ao registrar questão: ', error: error.message });
    }
    return res.status(500).json({ message: 'Erro desconhecido ao registrar a questão' });
  }
});

// Endpoint para recuperar as questões
routes.post('/questions', async (req, res) => {
  try {

    const existingQuestion = await db('questions');

    if (existingQuestion) {
      return res.status(201).json({ existingQuestion });
    } else{
      return res.status(404).json({ message: 'Questão não encontrada' });
    }
    
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Erro ao verificar a primeira tarefa do usuário: ', error: error.message });
    }
    return res.status(500).json({ message: 'Erro desconhecido ao verificar a primeira tarefa do usuario' });
  }
});
//#endregion

//#region XP and Levels
// Endpoint para recuperar o XP e Nivel atual do usuário
routes.post('/xp', async (req, res) => {
  const { id } = req.body;
  try {
    let userXp = 0;
    let userLevel = '';

    const existingUser: User = await db('users_login').where({ id }).first();
    
    if (existingUser) {
      userXp = existingUser.xp;
      userLevel = existingUser.level;
    }

    return res.status(201).json({ userXp, userLevel });
    
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: 'Erro ao verificar a primeira tarefa do usuário: ', error: error.message });
    }
    return res.status(500).json({ message: 'Erro desconhecido ao verificar a primeira tarefa do usuario' });
  }
});
//#endregion

export default routes;