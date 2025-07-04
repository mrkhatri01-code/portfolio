import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for server-side usage
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase environment variables. Using dummy client.")
    // Return a dummy client that won't throw errors but won't work either
    return createDummyClient()
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Create a singleton for client-side usage
let clientSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase environment variables. Using dummy client.")
    // Return a dummy client that won't throw errors but won't work either
    return createDummyClient()
  }

  clientSupabaseClient = createClient<Database>(supabaseUrl, supabaseKey)
  return clientSupabaseClient
}

// Create a dummy client that returns empty data but doesn't throw errors
function createDummyClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
              data: null,
              error: null,
            }),
            single: () => Promise.resolve({ data: null, error: null }),
            data: null,
            error: null,
          }),
          limit: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
            data: null,
            error: null,
          }),
          single: () => Promise.resolve({ data: null, error: null }),
          data: null,
          error: null,
        }),
        order: () => ({
          limit: () => ({
            data: null,
            error: null,
          }),
          data: null,
          error: null,
        }),
        limit: () => ({
          data: null,
          error: null,
        }),
        data: null,
        error: null,
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
        match: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        list: () => Promise.resolve({ data: [], error: null }),
        remove: () => Promise.resolve({ data: null, error: null }),
      }),
      createBucket: () => Promise.resolve({ data: null, error: null }),
    },
    auth: {
      signUp: () => Promise.resolve({ data: null, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  } as unknown as ReturnType<typeof createClient<Database>>
}

