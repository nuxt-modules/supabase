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

      const warningLines = fullOutput.split('\n').filter((line) => {
        const lowerLine = line.toLowerCase()
        return lowerLine.includes('warn') && !lowerLine.includes('warming') // Exclude "warming up" messages
      })

      // Log all warnings using consola
      if (warningLines.length > 0) {
        consola.error(`Found ${warningLines.length} warning(s) in dev server output:`)
        warningLines.forEach((line, index) => {
          consola.warn(`Warning ${index + 1}:`, line.trim())
        })
      }
      else {
        consola.success('No warnings found in dev server output')
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
