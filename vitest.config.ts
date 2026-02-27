import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'json-summary'],
			include: ['src/modules/**/services/*.ts'],
			exclude: ['src/modules/**/services/errors/*.ts']
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@prisma': resolve(__dirname, './prisma'),
			'@tests': resolve(__dirname, './tests')
		}
	}
})
