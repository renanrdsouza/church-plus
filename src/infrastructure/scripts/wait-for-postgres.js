const { exec } = require("node:child_process");

const checkPostgres = () => {
  exec("docker exec postgres_dev pg_isready --host localhost", handleReturn);
}

const handleReturn = (error, stdout) => {
  if(stdout.search("accepting connections") === -1) {
    process.stdout.write(".");
    setTimeout(checkPostgres, 1000);
    return;
  }

  console.log("\n🟢 Postgres is ready and accepting connections!\n");
}

process.stdout.write("\n\n🔴 Waiting for Postgres to be ready to receive connections...");

checkPostgres();
