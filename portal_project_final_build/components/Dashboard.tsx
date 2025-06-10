
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [dependencies, setDependencies] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: taskLogs } = await supabase.from('portal_task_log').select('*').order('timestamp', { ascending: false })
    const { data: errorLogs } = await supabase.from('portal_error_log').select('*').order('timestamp', { ascending: false })
    const { data: deps } = await supabase.from('task_dependencies').select('*')

    setLogs(taskLogs || [])
    setErrors(errorLogs || [])
    setDependencies(deps || [])
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>📊 Task Execution Dashboard</h1>

      <section>
        <h2>✅ Recent Task Executions</h2>
        <ul>
          {logs.map((log, idx) => (
            <li key={idx}>
              <strong>{log.task_type}</strong> - {log.status} ({log.duration_sec}s)
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>⚠️ Errors</h2>
        <ul>
          {errors.map((err, idx) => (
            <li key={idx}>
              <strong>{err.context}</strong>: {err.message}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>🔗 Dependencies</h2>
        <ul>
          {dependencies.map((dep, idx) => (
            <li key={idx}>
              Task {dep.task_id} ➜ depends on ➜ {dep.depends_on}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
