export interface IDatabaseVersionRecord {
  server_version: string;
}

export interface IDatabaseMaxConnections {
  max_connections: string;
}

export interface IDatabaseOpennedConnections {
  count: number
}