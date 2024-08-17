let searchBtn = document.getElementById("searchBtn");
let searchInp = document.getElementById("searchInp");

function fn(){
    const value = searchInp.value;
    console.log(value);
    var searchURL = "/listings/search?location="+encodeURIComponent(value);
    window.location.href = searchURL;
}
searchBtn.addEventListener("click", fn);

// searchInp.addEventListener("input", e=>{
//       const value=e.target.value;
//       console.log(value);
//       var searchURL = "/listings/search?location="+encodeURIComponent(value);
//       window.location.href = searchURL;
//     })