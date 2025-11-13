export const sendToN8nWebhook = async (applicationData) => {
  const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL

  if (!WEBHOOK_URL) {
    console.warn('N8N Webhook URL no configurada')
    return { error: 'Webhook URL no configurada' }
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Datos enviados a n8n exitosamente:', data)
    return { data, error: null }
  } catch (error) {
    console.error('❌ Error al enviar a n8n:', error)
    return { data: null, error }
  }
}
