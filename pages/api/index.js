import yaml from 'js-yaml'

export async function getConfig() {
    const config = await import(`../../app/data/config.yml`)
    return yaml.safeLoad(config.default)
}
