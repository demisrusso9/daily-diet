import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

const aliases = {
	'@': resolve(__dirname, './src'),
	'@prisma/generated': resolve(__dirname, './src/prisma/generated'),
	'@tests': resolve(__dirname, './tests')
}

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json-summary'],
			include: ['src/modules/**/services/*.ts'],
			exclude: ['src/modules/**/services/errors/*.ts'],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80
			}
		},
		projects: [
			{
				test: {
					name: 'unit',
					globals: true,
					include: ['tests/unit/modules/**/*.spec.ts']
				},
				resolve: { alias: aliases },
				extends: true
			},
			{
				test: {
					name: 'e2e',
					globals: true,
					include: ['tests/e2e/**/*.spec.ts'],
					environment: './prisma/vitest-environment-prisma/index.ts',
					sequence: { concurrent: false }
				},
				resolve: { alias: aliases },
				extends: true
			}
		]
	}
})
