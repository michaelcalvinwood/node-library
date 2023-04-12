require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { Client } = require('pg');
const pgvector = require('pgvector/pg');

const config = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
};
const pgClient = new Client(config);

let connectedFlag = false;

const getEmbedding = async (input) => {
  const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const embeddingResponse = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input,
    })

    const [{ embedding }] = embeddingResponse.data.data
    return embedding;
}

const run = async () => {
  if (!connectedFlag) return;
  try {
    const string = 'hello world';
    const embedding = await getEmbedding (string);
    const q = `INSERT INTO posts (body, embedding) VALUES ('${string}', '${[pgvector.toSql(embedding)]}')`;
    console.log('query', q);

    await pgClient.query(q);   
  } catch (error) {
    console.log(error);
  }
}

// connect to postgres database
(async () => {
  await pgClient.connect();
  try {
    const res = await pgClient.query('SELECT * from posts');
    console.log(res);
    await pgvector.registerType(pgClient);
    connectedFlag = true;
  } catch (error) {
    console.log(error);
  } 
})().catch(console.error);

// give program 2 seconds to make the postgres connection and then run
setTimeout(run, 2000);

