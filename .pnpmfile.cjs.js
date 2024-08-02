module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === "sharp") {
        pkg.optionalDependencies = pkg.optionalDependencies || {};
        pkg.optionalDependencies["sharp"] = pkg.version;
      }
      return pkg;
    },
  },
};
