import { fastify } from 'fastify'
import { fileURLToPath } from 'url'
import path from 'path'
import fastifyStatic from '@fastify/static'
// import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

// const database = new DatabaseMemory()
const database = new DatabasePostgres()

// Serve arquivos estáticos do React (pasta public)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
})

// Rotas da API
server.post('/videos', async (request, reply) => {
  const { title, description, duration } = request.body

  await database.create({
    title,
    description,
    duration,
  })

  return reply.status(201).send()
})

server.get('/videos', async (request) => {
  const search = request.query.search
  const videos = await database.list(search)
  return videos
})

server.put('/videos/:id', async (request, reply) => {
  const videoId = request.params.id
  const { title, description, duration } = request.body

  await database.update(videoId, {
    title,
    description,
    duration,
  })

  return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
  const videoId = request.params.id
  await database.delete(videoId)
  return reply.status(204).send()
})

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333,
})
