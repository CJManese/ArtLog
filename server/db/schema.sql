DROP TABLE IF EXISTS commission_references;
DROP TABLE IF EXISTS commissions;
DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  notes TEXT,
  blacklisted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE commissions (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  commission_type TEXT NOT NULL,
  starting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  deadline DATE,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  status TEXT NOT NULL DEFAULT 'Ongoing'
);

CREATE TABLE commission_references (
  id SERIAL PRIMARY KEY,
  commission_id INTEGER NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);
