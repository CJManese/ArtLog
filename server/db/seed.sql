INSERT INTO clients (name, notes, blacklisted)
VALUES
  ('DigitalPawz', '', FALSE),
  ('Bejoja', '', FALSE),
  ('HiAmPotato', '', FALSE);

INSERT INTO commissions (
  client_id,
  title,
  description,
  notes,
  commission_type,
  starting_date,
  deadline,
  payment_status,
  status
)
VALUES
  (
    1,
    'RocketShip Art Piece',
    'Commission to draw Bloons ship art with Rosalia and Brickell.',
    '',
    'Full-Body',
    '2026-09-20',
    '2026-10-18',
    'Paid',
    'Ongoing'
  ),
  (
    2,
    'Bejoja Tato',
    '',
    '',
    'YCH Sticker',
    '2026-08-11',
    NULL,
    'Pending',
    'Ongoing'
  ),
  (
    3,
    'Aster Triangles',
    '',
    '',
    'Half-Body',
    '2026-08-05',
    NULL,
    'Overdue',
    'Ongoing'
  );
