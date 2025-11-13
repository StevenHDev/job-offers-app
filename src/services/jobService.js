import { supabase } from '../lib/supabaseClient'
import {
  addRequirementsToJob,
  removeRequirementsFromJob
} from './requirementService'

export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createJob = async (job) => {
  const { requirements, ...jobData } = job
  const { data, error } = await supabase.from('jobs').insert([jobData]).select()
  console.log('Job insert result:', { data, error })
  if (error || !data || !data[0]) return { data, error }
  const jobId = data[0].id
  if (requirements && requirements.length > 0) {
    await addRequirementsToJob(jobId, requirements)
  }
  return { data, error }
}

export const updateJob = async (id, updates) => {
  // Separar los requerimientos del resto
  const { requirements, ...jobData } = updates
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', id)
    .select()
  if (error) return { data, error }
  // Actualizar requerimientos relacionales
  await removeRequirementsFromJob(id)
  if (requirements && requirements.length > 0) {
    await addRequirementsToJob(id, requirements)
  }
  return { data, error }
}

export const deleteJob = async (id) => {
  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id)
    .select()
  return { data, error }
}

export const getJobById = async (id) => {
  // Obtener el job y sus requerimientos
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()
  if (!data) return { data, error }
  // Obtener requerimientos relacionales
  const reqRes = await supabase
    .from('job_requirements')
    .select('requirement_id, requirements(name)')
    .eq('job_id', id)
  data.requirements = reqRes.data
    ? reqRes.data.map((r) => r.requirement_id)
    : []
  data.requirement_names = reqRes.data
    ? reqRes.data.map((r) => r.requirements?.name)
    : []
  return { data, error }
}
