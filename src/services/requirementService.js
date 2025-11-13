import { supabase } from '../lib/supabaseClient'

export const getRequirements = async () => {
  const { data, error } = await supabase.from('requirements').select('*')
  return { data, error }
}

export const createRequirement = async (name) => {
  const { data, error } = await supabase
    .from('requirements')
    .insert([{ name }])
    .select()
  return { data, error }
}

export const getJobRequirements = async (jobId) => {
  const { data, error } = await supabase
    .from('job_requirements')
    .select('requirement_id, requirements(name)')
    .eq('job_id', jobId)
  return { data, error }
}

export const addRequirementsToJob = async (jobId, requirementIds) => {
  // requirementIds: array de UUIDs
  const inserts = requirementIds.map((id) => ({
    job_id: jobId,
    requirement_id: id
  }))
  const { data, error } = await supabase
    .from('job_requirements')
    .insert(inserts)
    .select()
  return { data, error }
}

export const removeRequirementsFromJob = async (jobId) => {
  const { data, error } = await supabase
    .from('job_requirements')
    .delete()
    .eq('job_id', jobId)
  return { data, error }
}
