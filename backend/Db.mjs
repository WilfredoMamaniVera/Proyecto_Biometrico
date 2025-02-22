import { createClient } from "@libsql/client";

// Configura las variables directamente en el código
const TURSO_DATABASE_URL = "libsql://biometrico-sheal.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Mzk5MDk4MjAsImlkIjoiZmNiZWMzMjYtNTg5NS00N2U2LTlmZmUtYTYzNjdjYTAyZWE0In0._eJf6kvx5mGA0_fJTMGuu76bwYQ2opLinTPQCi9SBcr67lSAG91u7a2dVZfHx7tscZZG7mw4W_F2siSBaB9VCg";

// Crear el cliente utilizando los valores configurados
export const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

