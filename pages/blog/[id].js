import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const BlogPost = ({ article }) => {
  const router = useRouter();

  if (!article) {
    return <div>Cet article n existe pas.</div>;
  }

  return (
    <div>
      <Head>
        <title>{article.titre}</title>
        <meta name="description" content={article.description} />
      </Head>
      <h1>{article.titre}</h1>
      <p>Par {article.author}</p>
      <p>{article.description}</p>
      {}
      <Link href="/">Revenir à la liste des articles</Link>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  
  const filePath = require('path').join(process.cwd(), 'db.json');
  const jsonData = await require('fs').promises.readFile(filePath, 'utf8');
  const data = JSON.parse(jsonData);

  const postId = parseInt(params.id);

  const article = data.elements.find(item => item.id === postId);

  return {
    props: {
      article: article || null,
    },
  };
}

export default BlogPost;
