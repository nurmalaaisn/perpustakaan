const mysql = require('mysql2/promise');

async function fix() {
    const connection = await mysql.createConnection(
        'mysql://root:osbnlbWZHsNpOQVPwMeBnNhwXHrWYPBy@trolley.proxy.rlwy.net:45340/railway'
    );

    await connection.execute(
        "DELETE FROM _prisma_migrations WHERE migration_name = '20260208150129_make_nis_optional'"
    );

    console.log('Migration deleted!');
    await connection.end();
}

fix();