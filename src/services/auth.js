import { supabase } from './supabase'

export const signup = async ({ email, username, password }) => {
  console.log(email, username, password)
  let { data: userData, error: userError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (userError) throw new Error(userError)

  console.log(userData)
  const { data, error } = await supabase
    .from('users')
    .insert([{ user_id: userData.user.id, username: username }])
    .select()

  return userData
}

export const login = async ({ email, password }) => {
  console.log(email, password)
  if (password.length < 6)
    throw new Error('Password should have 6 characters at least')
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log(error)
  if (error) throw new Error(error)
  return data
}

export const getCurrentUser = async () => {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) return null
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    throw new Error(error.message)
  }

  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', data.user.id)
  console.log(session.session)
  // console.log(data?.user)
  return { data: data?.user, user }
  // return data?.user
}

export const getUserById = async (id) => {
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.getUserById(id)
  console.log(error)
  if (error) throw new Error(error)

  console.log(users)
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', users.user.id)

  return { users, user }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }
}
