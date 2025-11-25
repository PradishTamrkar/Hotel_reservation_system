const {db: sequelize} = require ('../config/config');

async function initializeDatabase() {
    try{
        console.log('Connecting database')
        await sequelize.authenticate()
        console.log('Connected to database')

        console.log('Creating tables...');
        await sequelize.sync({ alter: false });
        console.log('Database tables created successfully');

        process.exit(0);
    }catch(error){
        console.error('Error:', error);
        process.exit(1);
    }
}

initializeDatabase();