import { FC } from "react"; 
import "bootstrap-icons/font/bootstrap-icons.css";

interface ImagesProps{
    data:{
        src: string;
        title: string;
        description: string;
    }[];
    onClick: (idx: number) => void;
    passed: boolean
    passedIt: Function;
}


const Images: FC<ImagesProps> = (props) => {
  const { data, onClick } = props;

  const handleClickImage = (idx:number) => {
    onClick(idx)
  }

  const deletePic = async (idx : number) => {
    console.log(idx)
    var retrievedObject = localStorage.getItem('theKey');
    let arr = JSON.parse(retrievedObject || '{}')
    //console.log(arr)
    arr.splice(idx, 1); 
    //console.log(arr)
    localStorage.setItem("theKey", JSON.stringify(arr));
    ///////////////////////////////////////////
    await fetch(`http://localhost:5174/images/${idx}`,{
      method: "DELETE",
    });


    props.passedIt(false);
  }

  return (
    <div className="images-container">
        {data.map((slide, index ) => (
            <div>
            {props.passed ?  (<span className="abs" onClick={()=>deletePic(index)}><i className="bi bi-x-circle"></i></span> ) : <></>}
            <div onClick={()=>handleClickImage(index)} key={index} className="image">
                <img src={slide.src} alt={slide.description} />
            </div>
            </div>

        ))}
    </div>
  )
}

export default Images