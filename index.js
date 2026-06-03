require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const OBJECT_TYPE = '2-203656689';
const PROPERTIES = ['name', 'species', 'bio'];

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');
// GET / - Renders homepage with table of all custom object records
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=${PROPERTIES.join(',')}`;
  try {
    const response = await axios.get(url, { headers });
    res.render('homepage', {
      title: 'Homepage | Integrating With HubSpot I Practicum',
      records: response.data.results,
      properties: PROPERTIES
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error fetching records.');
  }
});
// GET /update-cobj - Renders form for creating a new custom object record
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    properties: PROPERTIES
  });
});
// POST /update-cobj - Creates a new custom object record from form data
app.post('/update-cobj', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
  const properties = {};
  PROPERTIES.forEach((p) => { properties[p] = req.body[p]; });
  try {
    await axios.post(url, { properties }, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error creating record.');
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));