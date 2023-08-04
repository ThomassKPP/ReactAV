import path from 'path';

export default function handler(req, res) {
  if (req.method === 'DELETE') {
    const id = parseInt(req.query.id, 10);
    const filePath = path.join(process.cwd(), 'data/db.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);

    const index = data.elements.findIndex(item => item.id === id);

    if (index !== -1) {
      data.elements.splice(index, 1);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

      return res.status(200).json({ message: 'Element deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Element not found' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
