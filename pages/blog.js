import fs from 'fs';
import path from 'path';

const BlogPage = ({ item }) => {
  return (
    <div>
      {item ? (
        <>
          <h1>{item.title}</h1>
          <p>{item.content}</p>
        </>
      ) : (
        <p>Article non trouvé</p>
      )}
    </div>
  );
};

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'db.json');
  const jsonData = await fs.promises.readFile(filePath);
  const data = JSON.parse(jsonData);

  const item = data.elements.find(item => item.title === params.blog);

  return {
    props: {
      item: item ? item : null,
    },
  };
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'db.json');
  const jsonData = await fs.promises.readFile(filePath);
  const data = JSON.parse(jsonData);

  const paths = data.elements.map(item => ({
    params: { blog: item.title },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default BlogPage;
