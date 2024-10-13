import { useEffect, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
//import { slides } from './data'
import 'yet-another-react-lightbox/styles.css'
import { Captions, Download, Fullscreen } from 'yet-another-react-lightbox/plugins'
import Counter from "yet-another-react-lightbox/plugins/counter";
import 'yet-another-react-lightbox/plugins/captions.css'
import "yet-another-react-lightbox/plugins/counter.css";
import Images from './Images'
import axios from 'axios';



function App() {
  const [open, setOpen] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(-1)
  const [theUrl, setTheUrl] = useState<string>("")
  const [render, setRender] = useState<boolean>(false)
  const [slides, setSlides] = useState<any>([])
  const [theUrlLength, setTheUrlLength] = useState<number>(0)
  const [errMsg, setErrMsg] = useState<string>("")
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [imageUpload, setImageUpload] = useState<boolean>(false)
  const [getLocalImagesState, setGetLocalImagesState] = useState<boolean>(false)

  useEffect(()=>{
    setRender(false);

    async function getGlobalImages(){
      const response = await fetch(`http://localhost:5174/images/`);
      if(!response.ok){
        const message = `An error occured: ${response.statusText}`;
        console.error(message);
        return;
      }
      const images = await response.json();
      console.log("Retreiving MongoDB")
      //console.log(images);
      setSlides(images);
    }

    async function getLocalImages(){
      var retrievedObject = localStorage.getItem('theKey');
      //console.log(JSON.parse(retrievedObject || '{}'));
      setSlides(JSON.parse(retrievedObject || '{}'))
      console.log("Retreiving Local Storage")
    }

    if(!getLocalImagesState){
      getGlobalImages();
    }else{
      getLocalImages();
    }

    setRender(true);
    setImageUpload(false);
    
  },[showDelete, imageUpload, getLocalImagesState])

  /*
  useEffect(()=>{
    setRender(false);
    var retrievedObject = localStorage.getItem('theKey');
    //console.log(JSON.parse(retrievedObject || '{}'));
    setSlides(JSON.parse(retrievedObject || '{}'))
    //console.log(slides)
    setRender(true);
    setImageUpload(false)
  },[showDelete, imageUpload])
  */


  const imageSubmit = (e: any) => {
    e.preventDefault();
    const URL_REGEX= /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    if(!URL_REGEX.test(theUrl)){
            
      setErrMsg("invalid url")
      return;
  }
    if(theUrlLength === 0){
      setErrMsg('Cant leave empty')
      return;
    }
    let theArray = slides;
    theArray.push({src:theUrl, title:"a title", description: "descr"})
    localStorage.setItem("theKey", JSON.stringify(theArray));

    
    
    
    setTheUrl('')
    setRender(true);
  }

  const handleUrl = (e: any) => {
    setErrMsg('')
    setTheUrl(e.target.value);
    setTheUrlLength(e.target.value.length)
  }

  return (
    <>
    <header>
      <nav className='navbar'>
        <ul> 
          <li><h2><a href="#">Home</a></h2></li>
          <li><button onClick={()=>setGetLocalImagesState(!getLocalImagesState)}>Toggle Global vs Local</button></li>
        </ul>
       
      </nav>
    </header>
    <div className='addUrl'>
      <form onSubmit={imageSubmit}>
        <p>{errMsg}</p>
        <div className='makeRow'>
          <h2>Upload Image URL:</h2>
          <input className='urlInput' type="text" placeholder="Enter image link" value={theUrl} onChange={(e)=>handleUrl(e)}/>
          <button type="submit" className='submitButton'>Submit</button>
        </div>
      </form>

      {/* const [getLocalImagesState, setGetLocalImagesState] = useState<boolean>(false) */}
      
      <SetImage getLIState={getLocalImagesState}  imageUpload={imageUpload} setImageUpload={setImageUpload} slides={slides} />
    </div>
    
    {render ? (
      
    <div className='test'>
      <button className='showDeleteButton' onClick={()=>setShowDelete(!showDelete)}><i className="bi bi-trash"></i></button>
      <Images passedIt={setShowDelete} passed={showDelete}  data={slides} onClick={(curIdx)=>setIndex(curIdx)} />

      <div style={{ width: "100%", maxWidth: "900px", aspectRatio: "3 / 2" }}>
        <Lightbox
          plugins={[Captions, Counter, Download, Fullscreen]}
          
          counter ={{ container: {style: { top: "unset", bottom: 0 } }}}
          captions={{
            showToggle: true,
            descriptionTextAlign: 'center'
          }}
          carousel={{ padding: 64 }}
          
          slides={slides}
          //open={open}
          //close={()=>setOpen(false)}
          index={index}
          open={index >= 0}
          close={()=>setIndex(-1)}
        
        />
      </div>
    </div>) : <></>}

  
    </>
  )
}

export default App


function SetImage(props: any){
  const [file, setFile] = useState<any>('')

  let imageUploadRef = useRef<HTMLInputElement>(null);

  const handleImage = (e : any) =>{
      //console.log(e.target.files[0])
      setFile(e.target.files[0])
  }

  const handleApi = () => {
      const formData = new FormData()
      formData.append('image', file)
      axios.post('http://localhost:5174/upload', formData, {
      })
      .then((resp : any)=>{
        //console.log(resp.data.imageName)
        /*
        if(!getLocalImagesState){
      getGlobalImages();
    }else{
      getLocalImages();
    }
        */

    let theArray = [];
        if(!props.getLIState){ //getting global array then set array to local storage specifically and push the item 
          var retrievedObject = localStorage.getItem('theKey');
          //console.log(JSON.parse(retrievedObject || '{}'));
          //setSlides(JSON.parse(retrievedObject || '{}'))
          theArray = JSON.parse(retrievedObject || '{}');
          theArray.push({src:`http://localhost:5174/images/${resp.data.imageName}`, title:"a title", description: "descr"})
          props.setImageUpload(true)
          localStorage.setItem("theKey", JSON.stringify(theArray)); //and its set here 
          //console.log("Retreiving Local Storage")
          
        }else{

          theArray = props.slides; //HHHHEEEEEEERRRRRREEEEE!!!!!!!!!!!!!!!!! the slides are taken from mongodb and set equal to array 
          //AND THEN I PUSH THE MOST RECENT ITEM 
          theArray.push({src:`http://localhost:5174/images/${resp.data.imageName}`, title:"a title", description: "descr"})
          props.setImageUpload(true)
          localStorage.setItem("theKey", JSON.stringify(theArray)); //and its set here 

        }
        

        axios.post('http://localhost:5174/images/',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //body: JSON.stringify(url),
          body: {url:`http://localhost:5174/images/${resp.data.imageName}`, theId: theArray.length-1},
        })
        .then((res)=>{
          console.log(res);
        })
        .catch((error)=>{
          console.log(error)
        })

      })
      .catch(err=>console.log(err));
  }


  return(
      <div ref={imageUploadRef} className='uploadWrapper'>
        <h2>Upload Own Image: </h2>
              <input className='uploadInput' type="file" name="file"
                  onChange={handleImage}
              ></input>
          <button className='uploadButton' onClick={handleApi}>Submit File</button>
      </div>
  )
}
