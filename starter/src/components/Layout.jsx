// Layout.js
const Layout = ({ children }) => {
  return (
    <div>
      <div>{children}</div>
      <footer>
        <p>@PixelPopping Production</p>
        <a
          href="mailto:sydney-cook@outlook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          sydney-cook@outlook.com
        </a>
      </footer>
    </div>
  );
};

export default Layout;
