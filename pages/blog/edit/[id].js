import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../../components/header.js';

const UpdateBlogPost = ({ article }) => {
  const router = useRouter();
  const { id } = router.query;

  const [updatedArticle, setUpdatedArticle] = useState({
    nom: article.nom,
    author: article.author,
    description: article.description,
    titre: article.titre,
  });

  useEffect(() => {
    setUpdatedArticle({
      nom: article.nom,
      author: article.author,
      description: article.description,
      titre: article.titre,
    });
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedArticle((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/updateElement?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedArticle),
    });

    if (response.ok) {
      router.push(`/blog/${id}`);
    }
  };

  return (
    <div>
      <Head>
        <title>Modifier l article</title>
      </Head>
      <Header />
      <h1>Modifier l article</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          name="nom"
          value={updatedArticle.nom}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Auteur"
          name="author"
          value={updatedArticle.author}
          onChange={handleChange}
        />
        <textarea
          placeholder="Description"
          name="description"
          value={updatedArticle.description}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Titre"
          name="titre"
          value={updatedArticle.titre}
          onChange={handleChange}
        />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const filePath = require('path').join(process.cwd(), 'data/db.json');
  const jsonData = require('fs').readFileSync(filePath, 'utf8');
  const data = JSON.parse(jsonData);

  const postId = parseInt(params.id);

  const article = data.elements.find((item) => item.id === postId);

  return {
    props: {
      article: article || null,
    },
  };
}

export default UpdateBlogPost;
