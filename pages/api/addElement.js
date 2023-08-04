import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { titre, imageUrl } = req.body;

  try {
    const apiKey = '26dbee0e';
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(titre)}&language=fr`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'True') {
      const { Plot, imdbRating, Director, Genre, Poster } = data;

      const newElement = {
        titre,
        imageUrl: Poster,
        description: Plot,
        rating: imdbRating,
        director: Director,
        genre: Genre,
      };

      const filePath = path.join(process.cwd(), 'data/db.json');
      const jsonData = await fs.readFile(filePath, 'utf8');
      const dbData = JSON.parse(jsonData);

      let newId = 1;
      if (dbData.elements.length > 0) {
        const lastElement = dbData.elements[dbData.elements.length - 1];
        newId = lastElement.id + 1;
      }

      newElement.id = newId;
      dbData.elements.push(newElement);

      await fs.writeFile(filePath, JSON.stringify(dbData));
      res.status(200).json(newElement);
    } else {
      console.error('Movie not found');
      res.status(404).end();
    }
  } catch (error) {
    console.error('Error adding element:', error);
    res.status(500).end();
  }
}
