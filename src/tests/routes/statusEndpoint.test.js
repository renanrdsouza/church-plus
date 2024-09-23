test("should return database status info and http status code 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  const databaseVersion = responseBody.dependencies.database.version;
  const databaseMaxConnections =
    responseBody.dependencies.database.max_connections;
  const databaseActiveConnections =
    responseBody.dependencies.database.opennedConnections;
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

  expect(response.status).toBe(200);
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  expect(databaseVersion).toBe("16.4");
  expect(databaseMaxConnections).toEqual(100);
  expect(databaseActiveConnections).toEqual(1);
});
