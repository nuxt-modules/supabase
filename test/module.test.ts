import { describe, it, expect } from 'vitest'
import { exec } from 'node:child_process'
import { consola } from 'consola'

describe('Dev Server', () => {
  it('should not produce any warnings when starting dev server', async () => {
    let childProcess: ReturnType<typeof exec> | null = null

    try {
      // Start the dev server
      childProcess = exec('pnpm dev', {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: 'development' },
      })

      const output: string[] = []
      let serverReady = false

      // Collect output
      childProcess.stdout?.on('data', (data: Buffer) => {
        const text = data.toString()
        output.push(text)
        if (text.includes('Local:') || text.includes('localhost')) {
          serverReady = true
        }
      })

      childProcess.stderr?.on('data', (data: Buffer) => {
        output.push(data.toString())
      })

      // Wait for server to be ready or timeout
      const startTime = Date.now()
      while (!serverReady && Date.now() - startTime < 30000) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Give it a bit more time to show warnings
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Kill the server
      if (childProcess.pid) {
        try {
          process.kill(childProcess.pid, 'SIGTERM')
        }
        catch {
          // Process might already be dead
        }
      }

      // Wait for process to exit
      await new Promise(resolve => setTimeout(resolve, 1000))

      const fullOutput = output.join('\n')

      // Extract warning lines
      const allWarningLines = fullOutput.split('\n').filter((line) => {
        const lowerLine = line.toLowerCase()
        return lowerLine.includes('warn') && !lowerLine.includes('warming') // Exclude "warming up" messages
      })

      // Filter out acceptable warnings from @nuxt/supabase module
      const warningLines = allWarningLines.filter((line) => {
        // Accept warnings from @nuxt/supabase module (e.g., missing config, database types not found)
        return !line.includes('[@nuxt/supabase]')
      })

      // Log all warnings using consola
      if (allWarningLines.length > 0) {
        consola.info(`Found ${allWarningLines.length} total warning(s) in dev server output`)

        const acceptedWarnings = allWarningLines.filter(line => line.includes('[@nuxt/supabase]'))
        if (acceptedWarnings.length > 0) {
          consola.info(`Accepted ${acceptedWarnings.length} @nuxt/supabase module warning(s):`)
          acceptedWarnings.forEach((line) => {
            consola.box(line.trim())
          })
        }
      }

      if (warningLines.length > 0) {
        consola.error(`Found ${warningLines.length} unexpected warning(s):`)
        warningLines.forEach((line, index) => {
          consola.warn(`Warning ${index + 1}:`, line.trim())
        })
      }
      else {
        consola.success('No unexpected warnings found in dev server output')
      }

      expect(warningLines, `Expected 0 warnings but found ${warningLines.length}`).toHaveLength(0)
    }
    finally {
      // Cleanup: ensure process is killed
      if (childProcess && childProcess.pid) {
        try {
          process.kill(childProcess.pid, 'SIGKILL')
        }
        catch {
          // Already dead
        }
      }
    }
  }, 60000)
})
