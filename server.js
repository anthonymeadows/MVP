import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;
dotenv.config();
const app = express();
const expressport = process.env.PORT || 8000;
let connectionString = process.env.PG_DATABASE_URL;


const pool = new Pool({
    connectionString,
})

app.use(express.static("public"));
app.use(express.json());

app.get('/validateLogin', async (req, res) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        const allUsers = await pool.query('SELECT * FROM users')
        console.log(allUsers.rows)
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        console.log('validating credentials')
        // Check if a user with the given username exists
        if (result.rows.length > 0) {
            const storedPassword = result.rows[0].password;
            console.log('validating credentials')
            // Compare the stored password with the provided password
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

app.post('/create', async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body)
    let premium = false
    try {
        await pool.query('INSERT INTO users(username, email, password, premium) VALUES ($1, $2, $3, $4)', [username, email, password, premium]);
        res.status(200).json({ message: 'User created' });
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


app.listen(expressport, () => {
    console.log(`listening on Port ${expressport}`);
  });