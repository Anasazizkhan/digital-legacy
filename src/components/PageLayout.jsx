import { motion } from 'framer-motion';

const PageLayout = ({ 
  title, 
  description, 
  children, 
  backgroundImage,
  icon: Icon 
}) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.4
      }
    }
  };

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  return (
    <motion.div
      className="page-wrapper pt-20"
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      <div className="page-container">
        <motion.div
          className="min-h-screen"
          variants={childVariants}
        >
          <header className="page-header">
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {backgroundImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-purple-900/20" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-70" />
                  <motion.img
                    src={backgroundImage}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </motion.div>
              )}
            </div>
            <motion.div 
              className="page-header-content"
              variants={childVariants}
            >
              <motion.div 
                className="flex items-center justify-center gap-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {Icon && (
                  <motion.div
                    className="icon-container-lg glass-dark"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                )}
                <motion.h1 
                  className="page-title animate-gradient"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {title}
                </motion.h1>
              </motion.div>
              {description && (
                <motion.p
                  className="page-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {description}
                </motion.p>
              )}
            </motion.div>
          </header>

          <motion.div
            className="content-container"
            variants={childVariants}
            transition={{ delay: 0.6 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PageLayout; 