import { createApp } from 'vue'
import Tasks from '../src/Tasks.vue'
import { createCore } from '@y2kfund/core'

async function initializeApp() {
  try {
    console.log('🚀 Initializing Tasks app...')
    
    // Check for required environment variables
    const supabaseUrl = import.meta.env.VITE_SUPA_URL
    const supabaseAnon = import.meta.env.VITE_SUPA_ANON

    if (!supabaseUrl || !supabaseAnon) {
      throw new Error('Missing required environment variables: VITE_SUPA_URL and VITE_SUPA_ANON must be set in .env file')
    }

    console.log('🔧 Initializing app-core with Supabase config...')
    
    // Initialize app-core plugin with Supabase configuration
    const core = await createCore({
      supabaseUrl,
      supabaseAnon,
      query: { 
        staleTime: 60_000, 
        gcTime: 86_400_000, 
        refetchOnWindowFocus: false 
      }
    })
    
    console.log('✅ App-core initialized')
    
    // Get demo props from window
    const props = (window as any).__DEMO_PROPS__ || { userId: 'demo-user' }
    
    // Create and mount the app with app-core plugin
    createApp(Tasks, props)
      .use(core)  // This provides Supabase client and TanStack Query
      .mount('#app')

    console.log('✅ Tasks app initialized successfully with app-core')

  } catch (error) {
    console.error('Failed to initialize tasks app:', error)
    
    // Show error message in the DOM
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <div style="padding: 2rem; background: #f8d7da; color: #721c24; border-radius: 0.5rem; margin: 1rem;">
          <h2>Development Setup Error</h2>
          <p>Failed to initialize app-core: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <div style="margin: 1rem 0;">
            <h3>Checklist:</h3>
            <ul style="text-align: left;">
              <li>✅ @y2kfund/core is built and linked</li>
              <li>❓ Is Supabase accessible?</li>
              <li>❓ Does hf.tasks table exist?</li>
              <li>❓ Are environment variables set in .env file?</li>
            </ul>
          </div>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem;">
            Required .env file:<br>
            VITE_SUPA_URL=${import.meta.env.VITE_SUPA_URL || 'not set'}<br>
            VITE_SUPA_ANON=${import.meta.env.VITE_SUPA_ANON ? '***' + import.meta.env.VITE_SUPA_ANON.slice(-10) : 'not set'}
          </div>
          <details style="margin-top: 1rem;">
            <summary style="cursor: pointer;">Full error details</summary>
            <pre style="margin-top: 0.5rem; padding: 1rem; background: white; border-radius: 0.25rem; overflow: auto;">${error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}</pre>
          </details>
        </div>
      `
    }
  }
}

initializeApp()