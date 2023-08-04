import data from '../../../data/db.json';
import fs from 'fs';

export default function handler(req, res) {
  const { id } = req.query;

  const index = data.elements.findIndex((item) => item.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Element not found' });
  }

  data.elements.splice(index, 1);

  fs.writeFileSync('data/db.json', JSON.stringify(data, null, 2));

  return res.status(200).json({ message: 'Element deleted successfully' });
}
