const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="container mx-auto px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Codepad. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;