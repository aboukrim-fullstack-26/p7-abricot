import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <Logo variant="bottom" width={90} />
      <span className="footer__copy">Abricot {new Date().getFullYear()}</span>
    </footer>
  );
}
