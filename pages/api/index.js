import yaml from 'js-yaml'

export async function getConfig() {
    const config = await import(`../../data/config.yml`)
    return yaml.safeLoad(config.default)
}
