DROP TABLE IF EXISTS users, decks, flashcards, deck_flashcard;

CREATE TABLE IF NOT EXISTS users(
    id serial NOT NULL PRIMARY KEY,
    username varchar(30) NOT NULL,
    email varchar(80),
    password varchar(255) NOT NULL,
    premium boolean
);

CREATE TABLE IF NOT EXISTS decks(
    id serial PRIMARY KEY,
    deckname varchar(30),
    user_id integer REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS flashcards(
    id serial PRIMARY KEY,
    question varchar(500),
    answer varchar(500)
);

CREATE TABLE IF NOT EXISTS deck_flashcard(
    id serial PRIMARY KEY,
    deck_id integer REFERENCES decks(id),
    flashcard_id integer REFERENCES flashcards(id)
);

ALTER TABLE users
ADD CONSTRAINT unique_username
UNIQUE (username);

ALTER TABLE decks
ADD CONSTRAINT unique_deckname
UNIQUE (deckname);


INSERT INTO users (username, email, password, premium) VALUES
    ('john_doe', 'john@example.com', 'password123', true),
    ('jane_smith', 'jane@example.com', 'securepass', false),
    ('bob_jones', 'bob@example.com', 'pass1234', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO decks (deckname, user_id) VALUES
    ('Math Flashcards', 1),
    ('History Quiz', 2),
    ('Programming Concepts', 3)
ON CONFLICT (deckname) DO NOTHING;

INSERT INTO flashcards (question, answer) VALUES
    ('What is 2 + 2?', '4'),
    ('Who was the first president of the United States?', 'George Washington'),
    ('What is the capital of France?', 'Paris');

INSERT INTO deck_flashcard (deck_id, flashcard_id) VALUES
    (1, 1),
    (1, 2),
    (2, 2),
    (3, 3);