import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/header';
import styles from '../../../styles/blogPost.module.css';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';


const UpdateBlogPost = ({ article }) => {
  const router = useRouter();
  const { id } = router.query;

  const [updatedDescription, setUpdatedDescription] = useState(article.description);

  const handleChange = (e) => {
    setUpdatedDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/updateElement?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: updatedDescription }),
      });

      if (response.ok) {
        router.push(`/blog/${id}`);
      } else {
        console.error('Failed to update article');
      }
    } catch (error) {
      console.error('Error while updating article:', error);
    }
  };


  const rating = parseFloat(article.rating);
  const maxRating = 10;
  const numStars = 5;
  const filledStars = Math.floor((rating / maxRating) * numStars);
  const decimal = rating / maxRating - filledStars / numStars;
  const emptyStars = numStars - filledStars - (decimal > 0 ? 1 : 0);

  return (
    <div>
      <Head>
        <title>Modifier l article</title>
      </Head>
      <Header />
      <div className={styles.blogWrap}>
        <header>
            <h1>{article.titre}</h1>
            <p className={styles.blogDate}>Par {article.director}</p>
            <img src={article.imageUrl} alt={article.titre} />
        </header>
        <div className={styles.blogDesc}>
          <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Description"
            value={updatedDescription}
            onChange={handleChange}
          />
          <button type="submit">Mettre à jour</button>
          </form>
        </div>
        <div className={styles.blogSubCategory}>
          <p>Genre: {article.genre}</p>
        </div>
        <div className={styles.blogRating}>
          <p>Note: {article.rating}</p>
          <div className={styles.starContainer}>
            {[...Array(filledStars)].map((_, index) => (
              <FaStar key={index} className={styles.starIcon} />
            ))}
            {decimal > 0 && <FaStarHalfAlt className={styles.starIcon} />}
            {[...Array(emptyStars)].map((_, index) => (
              <FaRegStar key={index} className={styles.starIcon} />            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const filePath = require('path').join(process.cwd(), 'db.json');
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
