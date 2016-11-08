var srcRoot="./src/assets/",
    distRoot="./src/dist/"
module.exports={
  cssSrc:[srcRoot+"css/*.scss"],
  cssDist:distRoot+"css",
  jsSrc:srcRoot+"js/*.js",
  jsDist:distRoot+"js",
  imgSrc:[srcRoot+"img/*.{png,jpg,gif,ico}"],
  imgDist:distRoot+"img",
  jsSourceMap:false,
}