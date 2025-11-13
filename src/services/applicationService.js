import { supabase } from '../lib/supabaseClient'

export const uploadCV = async (file, userId) => {
  const fileName = `${userId}_${Date.now()}.pdf`
  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'application/pdf'
    })
  if (error) return { error }

  // Generar URL firmada válida por 7 días (604800 segundos)
  const { data: signedUrlData, error: signedError } = await supabase.storage
    .from('cvs')
    .createSignedUrl(fileName, 604800) // 7 días

  if (signedError) {
    console.error('Error generando URL firmada:', signedError)
    // Fallback a URL pública si falla
    const url = supabase.storage.from('cvs').getPublicUrl(fileName)
      .data.publicUrl
    return { url }
  }

  return { url: signedUrlData.signedUrl }
}

export const createApplication = async (applicationData) => {
  console.log(
    'applicationService.createApplication - Datos a insertar:',
    applicationData
  )

  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select()

  console.log('applicationService.createApplication - Resultado:', {
    data,
    error
  })

  if (error) {
    console.error(
      'applicationService.createApplication - Error completo:',
      error
    )
  }

  return { data, error }
}

export const updateApplicationStatus = async (applicationId, status) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)
    .select()
  return { data, error }
}

export const getApplicationsByJob = async (jobId) => {
  console.log('getApplicationsByJob - jobId recibido:', jobId)

  if (!jobId || jobId === 'undefined') {
    console.error('getApplicationsByJob - jobId inválido:', jobId)
    return { data: null, error: { message: 'Job ID es inválido o undefined' } }
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*, profiles(full_name, email)')
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false })

  console.log('getApplicationsByJob - Resultado:', { data, error })

  return { data, error }
}

export const getUserApplications = async (userId) => {
  console.log('getUserApplications - userId recibido:', userId)

  if (!userId || userId === 'undefined') {
    console.error('getUserApplications - userId inválido:', userId)
    return { data: null, error: { message: 'User ID es inválido o undefined' } }
  }

  const { data, error } = await supabase
    .from('applications')
    .select(
      `
      id,
      job_id,
      candidate_id,
      cv_url,
      cover_letter,
      status,
      applied_at,
      jobs:job_id (
        id,
        title,
        description,
        status
      ),
      profiles:candidate_id (
        full_name,
        email
      )
    `
    )
    .eq('candidate_id', userId)
    .order('applied_at', { ascending: false })

  console.log('getUserApplications - Resultado:', { data, error })

  return { data, error }
}

export const getAllApplications = async () => {
  console.log('getAllApplications - Obteniendo todas las aplicaciones')

  const { data, error } = await supabase
    .from('applications')
    .select(
      `
      id,
      job_id,
      candidate_id,
      candidate_name,
      candidate_email,
      cv_url,
      cover_letter,
      status,
      applied_at,
      jobs:job_id (
        id,
        title,
        description,
        status
      ),
      profiles:candidate_id (
        full_name,
        email
      )
    `
    )
    .order('applied_at', { ascending: false })

  console.log('getAllApplications - Resultado:', { data, error })

  return { data, error }
}

export const hasAlreadyApplied = async (jobId, candidateId) => {
  const { data, error } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('candidate_id', candidateId)
    .maybeSingle()

  // Si hay data, significa que ya existe una aplicación
  // Si data es null, no existe (esto es normal, no es un error)
  return {
    exists: !!data,
    error: error && error.code !== 'PGRST116' ? error : null
  }
}
