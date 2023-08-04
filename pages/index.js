import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from '../styles/blogList.module.css';
import AddArticle from './add-article';

const Home = ({ elements }) => {
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredData = elements.filter(
    item =>
      item.genre.toLowerCase().includes(filterText.toLowerCase()) &&
      (!filterCategory || item.categorie === filterCategory)
  );

  const handleDeleteArticle = async id => {
    try {
      const response = await axios.delete(`/api/deleteElement/${id}`);
      if (response.status === 200) {
        location.reload();
      }
    } catch (error) {
      console.error('Error while deleting article:', error);
    }
  };

  return (
    <div className={styles.bodyWrapper}>
      <AddArticle />
      <div className={styles.filterWrapper}>
        <input
          type="text"
          placeholder="Filtrer par Genre"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className={styles.filterInput}
        />
      </div>
      <ul className={styles.bloggrid}>
        {filteredData.map(item => (
          <li key={item.id} className={styles.blogitem}>
            <div className={styles.blogItemwrap}>
              <img src={item.imageUrl} className={styles.blogItemcover} />
              <h3 className={styles.Titre}>{item.titre}</h3>
              <div className={styles.genresWrapper}>
                {item.genre.split(', ').map(genre => (
                  <button key={genre} className={styles.genreTag} disabled>
                    {genre}
                  </button>
                ))}
              </div>
              <p className={styles.blogItemdesc}>{item.description}</p>

              <div className={styles.buttonT}>
                <Link className={styles.voirPlus} href={`/blog/${item.id}`}>
                  Lire plus
                </Link>
                <button className={styles.button} onClick={() => handleDeleteArticle(item.id)}>
                  Supprimer
                </button>
              </div>
            </div>
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

