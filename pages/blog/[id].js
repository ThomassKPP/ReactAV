import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import styles from '../../styles/blogPost.module.css';
import Header from '@/components/header';

const BlogPost = ({ article }) => {
  const router = useRouter();
  const { id } = router.query;

  if (!article) {
    return <div>Cet article n existe pas.</div>;
  }

  const handleDeleteArticle = async (id) => {
    try {
      const response = await axios.delete(`/api/deleteElement/${id}`);
      if (response.status === 200) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error while deleting article:', error);
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
      <Header />
      <div className={styles.blogWrap}>
        <Head>
          <title>{article.titre}</title>
          <meta name="description" content={article.description} />
        </Head>
        <header>
          <h1>{article.titre}</h1>
          <p className={styles.blogDate}>Par {article.director}</p>
          <img src={article.imageUrl} alt={article.titre} />
        </header>
        <div className={styles.blogDesc}>
          <p>{article.description}</p>
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
              <FaRegStar key={index} className={styles.starIcon} />
            ))}
          </div>
        </div>
        <Link href={`/blog/edit/${id}`} passHref>
          <p className={styles.modifier}>Modifier cet article</p>
        </Link>
        <button className={styles.button} onClick={() => handleDeleteArticle(article.id)}>
          Supprimer
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const filePath = require('path').join(process.cwd(), 'db.json');
  const jsonData = await require('fs').promises.readFile(filePath, 'utf8');
  const data = JSON.parse(jsonData);

  const postId = parseInt(params.id);

  const article = data.elements.find((item) => item.id === postId);

  return {
    props: {
      article: article || null,
    },
  };
}

export default BlogPost;
