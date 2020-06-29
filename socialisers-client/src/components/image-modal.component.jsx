import React, { useState, useCallback, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


const Modal = (props) => {
    const {imageFile, closeModal, getImageUrl, cardNum} = props
    const [imageSrc, setImageSrc] = useState();
    const [imageBlob, setImageBlob] = useState();
    const [imageValue, setImageValue] = useState(null);
    const [cropDimension, setCropDimension] = useState({ unit: '%', width: 50, height: 50});
    const [imageUrl, setImageUrl] = useState();
    const [cardIndex, setCardIndex] = useState()

    
    useEffect(() => {
        const reader = new FileReader();
        setCardIndex(cardNum)
        reader.addEventListener('load', () => setImageSrc(reader.result));
        reader.readAsDataURL(imageFile);
    },[imageFile])
    const imageLoadedHandler = useCallback(img => {
        setImageValue(img);
      }, []);
    
      async function setImage (cropDimension) {
          console.log(imageValue, cropDimension.width ,cropDimension.height);
          
        if (imageValue && cropDimension.width && cropDimension.height) {
            
          cropImage(imageValue, cropDimension);
        }
      };
      
      const sendImageUrl = () => {          
          console.log(imageUrl, cardIndex);
          
          getImageUrl(imageUrl, imageBlob, cardIndex)
      }

      
      /**
       * when the user stops adjusting cropDimension, the image value is set
       * If use draws nothing, the original image is made to a link and returned
       * @param {*} image 
       * @param {*} cropDimension 
       * @returns imageUrl
       */
      const cropImage = async (image, cropDimension) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = cropDimension.width;
        canvas.height = cropDimension.height;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
          image,
          cropDimension.x * scaleX,
          cropDimension.y * scaleY,
          cropDimension.width * scaleX,
          cropDimension.height * scaleY,
          0,
          0,
          cropDimension.width,
          cropDimension.height
        );
    
        return new Promise((resolve, reject) => {
          canvas.toBlob(blob => {
            if (!blob) {
                setImageUrl(window.URL.createObjectURL(imageFile));

              return;
            }
            
            blob.name = imageFile.name.split(".")[0];            
            window.URL.revokeObjectURL(imageUrl);            
            setImageUrl(window.URL.createObjectURL(blob));
            setImageBlob(blob)
            
          }, 'image/jpeg');
        });
      };

    return ( 
        <div className="modal">
            <div className="modal-content">
                <div className="modal-content__body">
                <ReactCrop
                    src={imageSrc}
                    keepSelection={true}
                    ruleOfThirds={true}
                    onImageLoaded={imageLoadedHandler}
                    crop={cropDimension}
                    onChange={c => setCropDimension(c)}
                    onComplete={setImage}
                />
                </div>
                <div className="modal-content__footer">
                    <p className="submit-button" onClick={sendImageUrl}
                    >Submit</p>
                    <p className="submit-button" onClick={closeModal}>
                        Close
                    </p>
                </div>
                    

            </div>
        </div>
   
     );
}
 
export default Modal;