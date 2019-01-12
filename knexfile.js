module.exports = {
  development: {
    client: "postgresql",
    connection: {
      user: process.env.DB_DEV_USER,
      password: process.env.DB_DEV_PASS,
      database: process.env.DB_DEV_DATABASE,
      port: process.env.DB_DEV_PORT,
      host: process.env.DB_DEV_HOST,
      ssl: false
    },
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds"
    }
  },
  prod: {
    client: "postgresql",
    connection: {
      host: "safuburnrate.cvdzhktav8eh.us-west-1.rds.amazonaws.com",
      port: 5432,
      database: "safuburnrate",
      user: "safuburnrateadmin",
      password: "safuburnrate!",
      ssl: true
    },
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds"
    }
  },
  staging: {
    client: "postgresql",
    connection: {
      host: process.env.AWS_STAGING_DB_HOST,
      port: process.env.AWS_STAGING_DB_PORT,
      database: process.env.AWS_STAGING_DB_DATABASE,
      user: process.env.AWS_STAGING_DB_USER,
      password: process.env.AWS_STAGING_DB_PASSWORD,
      ssl: true
    },
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds"
    }
  }
};
