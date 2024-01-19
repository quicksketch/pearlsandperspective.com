import fs from 'fs'
import YAML from 'yaml'

// Convert the quotes YAML to JSON for web use.
const quotesFile = fs.readFileSync('../../quotes.yml', 'utf8');
const quotesData = YAML.parse(quotesFile);
fs.writeFileSync('../site/quotes.json', JSON.stringify(quotesData));

// Pull the list of images and save to JSON for web use.
const imageNames = fs.readdirSync('../../images').filter(name => name.endsWith('.jpg'));
fs.writeFileSync('../site/images.json', JSON.stringify(imageNames));

// Copy images to the site directory for deployment.
fs.cpSync('../../images', '../site/images', { recursive: true });