module.exports = {
    apps : [{
        name: 'pwnme-api',
        script: '/usr/src/app/dist/main.js',
        time: true,
        exec_mode : "cluster",
        instances: 'max',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
    }],
};