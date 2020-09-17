module.exports = {
    target: 'serverless',
    webpack: function (config, { isServer }) {
        config.module.rules.push({ test: /\.md$/, use: 'raw-loader' })
        config.module.rules.push({ test: /\.yml$/, use: 'raw-loader' })

        // Fixes npm packages that depend on `fs` module
        // Решение проблемы: Module not found: Can't resolve 'fs'
        if (!isServer) {
            config.node = {
                fs: 'empty'
            }
        }
        return config
    }
}