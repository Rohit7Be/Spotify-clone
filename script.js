console.log("lets write some javascript")

currentSong = new Audio()
let songse;

let currFolder;


function formatDecimalTime(decimalSeconds) {
    const minutes = Math.floor(decimalSeconds / 60);
    const remainingSeconds = decimalSeconds % 60;

    // Pad with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = Math.floor(remainingSeconds.toFixed(2).padStart(5, '0')); // Ensures two decimal places

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    console.log(as)
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }

   // show all the songs in playlist
   let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
   songUL.innerHTML = ""
   for (const song of songs) {
       songUL.innerHTML = songUL.innerHTML + `<li> <img src="music.svg" class="invert" alt="">
                           <div class="songinfo">
                           
                               <div>${song.replaceAll("%20", " ")}</div>
                               <div>Rohit</div>
   
                           </div>
                       <div class="playNow">
                           
                           <img src="play.svg" alt="" class="invert">
                       </div>
       
       
       
        </li>`;
       
   }

   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
       e.addEventListener("click", element=>{
           console.log(e.querySelector(".songinfo").firstElementChild.innerHTML)
           playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML)
       })
   })
    
    return songs;
}

const playMusic= (track, pause=false)=>{
    // let audio = new Audio("/Songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    
    
    document.querySelector(".Songnameinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/Songs/`);
    let response = await a.text();
    
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors  = div.getElementsByTagName("a")
    
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        
        if(e.href.includes("/Songs/")){
            let folder = e.href.split("/").slice(-1)[0]
            // getting the metadata of the folder 
            let a = await fetch(`http://127.0.0.1:5500/Songs/${folder}/info.json`)
            let response = await a.json();
            let cardContainer = document.querySelector(".cardContainer")
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="50" height="50">
                                <circle cx="256" cy="256" r="256" fill="green" />
                                <path d="M200 140c-13.3-8.1-30-8.4-43.5-.8S136 163.6 136 180v152c0 15.6 8.4 30 21.5 37.5s29.7 7.2 43.5-.8l215-121.5c12.8-7.2 20.7-20 20.7-34s-7.9-26.8-20.7-34L200 140z" fill="white" />
                              </svg>    
                        </div>
                        <img src="/Songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click", async item=>{
            console.log(item,item.currentTarget.dataset)
            songse = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)

        })
    })

}


async function main(){
    songse = await getSongs("Songs/Chill") // when opening the app, this folder will already be loaded
    console.log(songse)

    playMusic(songse[0], true)

    displayAlbums()
// adding event listener to play pause buttons 
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime , currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatDecimalTime(currentSong.currentTime)}/${formatDecimalTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent +"%"
        currentSong.currentTime = (currentSong.duration * percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"

    })

    previous.addEventListener("click", ()=>{
        console.log("previous click")
        let index = songse.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songse, index)
        if((index-1)>=0){
            playMusic(songse[index-1])
        }
    })

    next.addEventListener("click", ()=>{
        console.log("next click")
        let index = songse.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songse, index)
        
        if((index+1)< songse.length){

            playMusic(songse[index+1])
        }
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e.target.value) 
        // this will give you the value of the range, when we will click 
        currentSong.volume = (e.target.value)/100
    })

    // for clicking on album display all the songs
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e)
        e.addEventListener("click", async item=>{
            console.log(item,item.currentTarget.dataset)
            songse = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)

        })
    })


    // adding event listener for mute button 
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .20;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }

    })






}
main()

