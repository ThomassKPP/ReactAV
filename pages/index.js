import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Home = ({ elements }) => {
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [newElement, setNewElement] = useState({
    nom: '',
    author: '',
    description: '',
    categorie: '',
    titre: '',
  });
  const [categories, setCategories] = useState([]);

  const uniqueCategories = [...new Set(elements.map(item => item.categorie))];
  useEffect(() => {
    setCategories(uniqueCategories);
  }, [elements]);

  const filteredData = elements.filter(item =>
    item.titre.toLowerCase().includes(filterText.toLowerCase()) &&
    (!filterCategory || item.categorie === filterCategory)
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setNewElement(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    const response = await fetch('/api/addElement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newElement),
    });

    if (response.ok) {
      setNewElement({
        nom: '',
        author: '',
        description: '',
        categorie: '',
        titre: '',
      });
      location.reload();
    }
  };

  return (
    <div>
      <Head>
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/blog-style.css" />
      </Head>
      <form>
        <textarea
          placeholder="Description"
          name="description"
          value={newElement.description}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Nom"
          name="nom"
          value={newElement.nom}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Auteur"
          name="author"
          value={newElement.author}
          onChange={handleChange}
        />
        <select
          name="categorie"
          value={newElement.categorie}
          onChange={handleChange}
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Titre"
          name="titre"
          value={newElement.titre}
          onChange={handleChange}
        />
        <button type="button" onClick={handleSubmit}>
          Ajouter
        </button>
      </form>

      <input
        type="text"
        placeholder="Filtrer par titre"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
      <select
        value={filterCategory}
        onChange={e => setFilterCategory(e.target.value)}
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <ul>
        {filteredData.map(item => (
          <li key={item.id}>
            <Link href={`/blog/${item.id}`}>{item.titre}</Link>
        </li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  const filePath = require('path').join(process.cwd(), 'db.json');
  const jsonData = await require('fs').promises.readFile(filePath, 'utf8');
  const data = JSON.parse(jsonData);

  return {
    props: {
      elements: data.elements || [],
    },
  };
}

export default Home;
