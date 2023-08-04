export default function handler(req, res) {
    const { id } = req.query;
  
    const filePath = require('path').join(process.cwd(), 'data/db.json');
    const jsonData = require('fs').readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
  
    const postId = parseInt(id);
  
    const index = data.elements.findIndex((item) => item.id === postId);
  
    if (index !== -1) {
      const updatedArticle = {
        ...data.elements[index],
        ...req.body,
      };
  
      data.elements[index] = updatedArticle;
  
      require('fs').writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  
      res.status(200).json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article non trouvé' });
    }
  }
  