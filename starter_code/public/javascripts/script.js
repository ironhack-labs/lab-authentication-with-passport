document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);





document.getElementById('poke-button').onclick = function() {
  console.log('You clicked the poke-button!');

  const theID = document.getElementById('poke-input').value;
  axios.get(`https://pokeapi.co/api/v2/pokemon/${theID}/`) //async, so promise
  .then((responseFromAPI)=>{
    document.getElementById('poke-info')
    .innerHTML = `<h3>${responseFromAPI.data.name}</h3>
                  <p><img src = "${responseFromAPI.data.sprites.front_default}"></p>

    `
  })
  
  .catch((err)=>{
    console.log(err); //we're on front end so no next(err) stuff.
  })

}



