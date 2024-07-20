import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.debug(`Current directory [${__dirname}]`)

const packageJsonPath = join(__dirname, '../package.json')
const readmePath = join(__dirname, '../README.md')
const firstMarkdownTitleRegex = /^# (.+)$/m
const packageNameScopeRegex = /^@.*\//

/**
 * Converts a package name to a formatted title.
 * @param {string} packageName - The original package name.
 * @returns {string} - The formatted title.
 */
const packageNameToTitle = (packageName) => {
	const nameWithoutScope = packageName.replace(packageNameScopeRegex, '')
	return nameWithoutScope
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

/**
 * Reads and parses the package.json file.
 * @param {string} packageJsonPath - The path to the package.json file.
 * @returns {object} - The parsed package.json content.
 */
const readPackageJson = (packageJsonPath) => {
	console.debug(`Reading package.json from [${packageJsonPath}]...`)
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
	console.info(`Extracted package name [${packageJson.name}]`)
	return packageJson
}

/**
 * Reads the README.md file.
 * @param {string} readmePath - The path to the README.md file.
 * @returns {string} - The content of the README.md file.
 */
const readReadme = (readmePath) => {
	console.debug(`Reading README.md from [${readmePath}]...`)
	return readFileSync(readmePath, 'utf8')
}

/**
 * Writes the updated content to the README.md file.
 * @param {string} readmePath - The path to the README.md file.
 * @param {string} content - The content to write to the README.md file.
 */
const writeReadme = (readmePath, content) => {
	writeFileSync(readmePath, content)
	console.info(`README.md updated successfully at [${readmePath}]`)
}

try {
	const packageJson = readPackageJson(packageJsonPath)
	const packageName = packageJson.name
	const desiredTitle = packageNameToTitle(packageName)
	const readmeContent = readReadme(readmePath)

	const currentTitleMatch = readmeContent.match(firstMarkdownTitleRegex)
	const currentTitle = currentTitleMatch ? currentTitleMatch[1] : ''
	console.info(`Current README title [${currentTitle}]`)

	if (currentTitle !== desiredTitle) {
		const updatedContent = readmeContent.replace(firstMarkdownTitleRegex, `# ${desiredTitle}`)
		writeReadme(readmePath, updatedContent)
		console.info(`README.md title updated to [${desiredTitle}]`)
	}
} catch (error) {
	console.error(`Failed with error [${error}]`)
}
