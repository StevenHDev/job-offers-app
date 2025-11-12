export const updateApplicationStatus = async (applicationId, status) => {
  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)
    .select()
  return { data, error }
}
export const getApplicationsByJob = async (jobId) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*, profiles(full_name, email)')
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false })
  return { data, error }
}
export const getUserApplications = async (userId) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*, jobs(title, company_info, location)')
    .eq('candidate_id', userId)
    .order('applied_at', { ascending: false })
  return { data, error }
}
export const hasAlreadyApplied = async (jobId, candidateId) => {
  const { data, error } = await supabase
    .from('applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('candidate_id', candidateId)
    .single()
  return { exists: !!data, error }
}
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
  const url = supabase.storage.from('cvs').getPublicUrl(fileName).publicUrl
  return { url }
}
