import React, { useState, useRef } from "react";
import Image from 'next/image';
import { Camera } from "react-camera-pro";

const QRScanner = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  return (
    <div>
      <Camera ref={camera} />
      <button onClick={() => setImage(camera.current.takePhoto())}>Take photo</button>
      <Image src={image} alt='Taken photo' />
    </div>
  );
}

export default QRScanner;