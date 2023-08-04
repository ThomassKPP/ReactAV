import { useState } from 'react';
import axios from 'axios';
import Header from '@/components/header';
import styles from '../styles/addArticle.module.css';

const AddArticle = () => {
  const [newElement, setNewElement] = useState({
    titre: '',
    imageUrl: '',
    description: '',
    rating: '',
    director: '',
    genre: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setNewElement(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const apiKey = '26dbee0e';
      const url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(
        newElement.titre
      )}&language=fr`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        const imageUrl = data.Poster;

        const articleData = {
          titre: data.Title,
          imageUrl: imageUrl,
          description: data.Plot,
          rating: data.imdbRating,
          director: data.Director,
          genre: data.Genre,
        };

        const postResponse = await axios.post('/api/addElement', articleData);

        if (postResponse.status === 200) {
          setNewElement({
            titre: '',
            imageUrl: '',
            description: '',
            rating: '',
            director: '',
            genre: '',
          });

          window.location.href = '/';
        }
      } else {
        console.error('Movie not found');
      }
    } catch (error) {
      console.error('Error while adding article:', error);
    }
  };

  return (
    <div>
      <Header />
      <form className={styles.formContainer}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Titre"
          name="titre"
          value={newElement.titre}
          onChange={handleChange}
        />

        {}
        {newElement.imageUrl && <img src={newElement.imageUrl} alt="Article Preview" />}

        <button className={styles.submitButton} type="button" onClick={handleSubmit}>
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddArticle;

