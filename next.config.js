const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const withInterceptStdout = require('next-intercept-stdout')

new CopyWebpackPlugin({
	patterns: [
		{
			from: path.join(
				path.dirname(require.resolve('pdfjs-dist/package.json')),
				'cmaps'
			),
			to: 'cmaps/',
		},
	],
}),
	(module.exports = withInterceptStdout(
		{
			reactStrictMode: true,
		},
		(text) => (text.includes('Duplicate atom key') ? '' : text)
	))
