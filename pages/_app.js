import '../public/style.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export function reportWebVitals(metric) {
  console.log(metric);
}

export default MyApp;

// Réinitialiser la marge du body
if (typeof window !== 'undefined') {
  document.body.style.margin = '0';
}
