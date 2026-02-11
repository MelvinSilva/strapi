module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      connectionString: env("DATABASE_PRIVATE_URL"),
    },
    pool: {
      min: 2, // Garde toujours 2 connexions prêtes
      max: 10, // Limite pour ne pas saturer Postgres
      acquireTimeoutMillis: 60000, // Attendre 60s que la DB réponde avant de crash
    },
  },
});
