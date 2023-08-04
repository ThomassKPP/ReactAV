import Link from 'next/link';
import styles from './header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <Link href="/">
          <p>Accueil</p>
        </Link>
        <Link href="/add-article">
          <p>Ajouter un article</p>
        </Link>
      </nav>
    </header>
  );
};

export default Header;