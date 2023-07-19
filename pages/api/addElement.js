import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { nom, author, description, categorie, titre } = req.body;
  const currentDate = new Date().toISOString().slice(0, 10);
  const newElement = { nom, author, description, categorie, titre, date: currentDate };

  try {
    const filePath = path.join(process.cwd(), 'db.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    let newId = 1;
    if (data.elements.length > 0) {
      const lastElement = data.elements[data.elements.length - 1];
      newId = lastElement.id + 1;
    }

    newElement.id = newId;
    data.elements.push(newElement);

    await fs.writeFile(filePath, JSON.stringify(data));
    res.status(200).json(newElement);
  } catch (error) {
    console.error('Error adding element:', error);
    res.status(500).end();
  }
}
