import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;
dotenv.config();
const app = express();
const expressport = process.env.PORT || 8000;
let connectionString = process.env.DATABASE_URL;


const pool = new Pool({
    connectionString,
})

app.use(express.static("public"));
app.use(express.json());

app.get('/validateLogin', async (req, res) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        console.log('validating credentials');
        if (result.rows.length > 0) {
            const storedPassword = result.rows[0].password;
            if (password === storedPassword) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.get('/userDeckList', async (req, res) => {
    try {
        const { username } = req.query;

        // Get userID
        const userIDResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

        if (userIDResult.rows.length === 0) {
            // User not found
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userID = userIDResult.rows[0].id;

        // Get decks for the user
        const decksResult = await pool.query('SELECT * FROM decks WHERE user_id = $1', [userID]);

        // Send the decks as a JSON response
        res.json({ success: true, decks: decksResult.rows });
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


app.post('/create', async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body);
    let premium = false;
    try {
        await pool.query('INSERT INTO users(username, email, password, premium) VALUES ($1, $2, $3, $4)', [username, email, password, premium]);
        res.status(200).json({ message: 'User created' });
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.post('/postdeck', async (req, res) => {
    try {
        let { deckName, currentUser } = req.body;
        let deckNameObj = {
            'deckname': deckName,
            'user_id': currentUser
        };

        // Check if a deck with the given name already exists for the current user
        const existingDeck = await pool.query('SELECT * FROM decks WHERE deckname = $1 AND user_id = (SELECT id FROM users WHERE username = $2)', [deckName, currentUser]);

        if (existingDeck.rows.length === 0) {
            // Deck does not exist, create it
            const currentUserIDResult = await pool.query('SELECT id FROM users WHERE username = $1', [currentUser]);
            const currentUserID = currentUserIDResult.rows[0].id;

            await pool.query('INSERT INTO decks(deckname, user_id) VALUES ($1, $2)', [deckName, currentUserID]);

            res.status(200).json({ success: true, message: `Deck ${deckName} created` });
        } else {
            // Deck already exists for the current user
            res.status(200).json({ success: false, error: `${deckNameObj} already exists` });
        }
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.delete('/deleteDeck', async (req, res) => {
    const { deckName, username } = req.body;
    console.log(username)

    try {
        // Get userID
        const userIDResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

        if (userIDResult.rows.length === 0) {
            // User not found
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const userID = userIDResult.rows[0].id;

        // Check if the deck exists for the current user
        const deckExistsResult = await pool.query('SELECT * FROM decks WHERE user_id = $1 AND deckname = $2', [userID, deckName]);

        if (deckExistsResult.rows.length === 0) {
            // Deck does not exist for the current user
            return res.status(404).json({ success: false, error: 'Deck not found' });
        }

        // If the deck exists, delete it
        await pool.query('DELETE FROM decks WHERE user_id = $1 AND deckname = $2', [userID, deckName]);

        // Send success response
        res.status(200).json({ success: true, message: 'Deck deleted successfully' });
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


app.listen(expressport, () => {
    console.log(`listening on Port ${expressport}`);
  });
