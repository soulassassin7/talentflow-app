const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TalentFlow Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;