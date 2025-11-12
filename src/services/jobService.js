import { supabase } from '../lib/supabaseClient'

export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createJob = async (job) => {
  const { data, error } = await supabase.from('jobs').insert([job]).select()
  return { data, error }
}

export const updateJob = async (id, updates) => {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
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
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}
