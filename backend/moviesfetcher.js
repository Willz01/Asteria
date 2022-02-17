const axios = require('axios')
const fs = require('fs')
const lineReader = require('line-reader')

// top 250 movies -- get IDs of top 100 movies
function save50() {
  axios.get('https://imdb-api.com/en/API/Top250Movies/k_c5si6nu7')
    .then(response => response)
    .then(result => {
      let json = result.data
      var result = [];

      for (var i in json) {
        result.push([i, json[i]]);
      }

      let items = JSON.stringify(result[0][1])
      let js = JSON.parse(items)
      let index = 0;
      for (let movieObj of js) {
        console.log(movieObj.id);
        if (index == 100)
          break;
        index = index + 1;
        fs.appendFileSync('./movieIDS.txt', `${movieObj.id}\n`, (err) => {
          if (err)
            console.error(err);
        })
      }
    })
    .catch(error => console.log('error', error));
}

save50()


// fetch and save movies.json with saved IDS
function getMovies() {
  lineReader.eachLine("./movieIDS.txt", (line, last) => {
    console.log(line);
    axios.get('https://imdb-api.com/en/API/Trailer/k_c5si6nu7/' + line)
      .then(response => response.data)
      .then(result => {
        let string = JSON.stringify(result)
        fs.appendFileSync('backend\movies.json', `${string},`, (err) => {
          if (err)
            console.error(err);
        })
      })
  });
}
//getMovies()