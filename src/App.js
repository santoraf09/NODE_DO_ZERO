import { useEffect, useState } from 'react'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://node-do-zero-hqr7.onrender.com'
})

function App() {
  const [videos, setVideos] = useState([])
  const [form, setForm] = useState({ id: null, title: '', description: '', duration: '' })

  async function fetchVideos() {
    const res = await api.get('/videos')
    setVideos(res.data)
  }

  async function createOrUpdate(e) {
    e.preventDefault()

    if (form.id) {
      await api.put(`/videos/${form.id}`, {
        title: form.title,
        description: form.description,
        duration: form.duration,
      })
    } else {
      await api.post('/videos', {
        title: form.title,
        description: form.description,
        duration: form.duration,
      })
    }

    setForm({ id: null, title: '', description: '', duration: '' })
    fetchVideos()
  }

  async function handleDelete(id) {
    await api.delete(`/videos/${id}`)
    fetchVideos()
  }

  function handleEdit(video) {
    setForm(video)
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Meus vídeos</h1>

      <form onSubmit={createOrUpdate}>
        <input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Duração (em segundos)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
        <button type="submit">{form.id ? 'Salvar alterações' : 'Adicionar'}</button>
        {form.id && <button onClick={() => setForm({ id: null, title: '', description: '', duration: '' })}>Cancelar</button>}
      </form>

      <ul>
        {videos.map(video => (
          <li key={video.id}>
            <strong>{video.title}</strong> - {video.duration}s
            <p>{video.description}</p>
            <button onClick={() => handleEdit(video)}>Editar</button>
            <button onClick={() => handleDelete(video.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App