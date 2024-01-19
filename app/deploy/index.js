import fs from 'fs'
import YAML from 'yaml'

const quotesFile = fs.readFileSync('../../quotes.yml', 'utf8');
const quotesData = YAML.parse(quotesFile);

fs.writeFileSync('../site/quotes.json', JSON.stringify(quotesData), { encoding: "utf8" });
