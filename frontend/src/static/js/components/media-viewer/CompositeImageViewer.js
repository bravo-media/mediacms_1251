import React, { useContext, useEffect, useState } from 'react';
import { SiteContext } from '../../utils/contexts';
import { MediaPageStore } from '../../utils/stores';

export default function CompositeImageViewer(props) {
  const site = useContext(SiteContext);

  let initialImage = getImageUrl();
  const mediaState = MediaPageStore.get('media-data');
  initialImage = initialImage ? initialImage : MediaPageStore.get('media-data').thumbnail_url;
  initialImage = initialImage ? initialImage : '';
  console.log(MediaPageStore.get('media-data'));

  const fontSize = mediaState.font_size;


  const [image, setImage] = useState(initialImage);

  function onImageLoad() {
    setImage(getImageUrl());
  }

  function getImageUrl() {
    const media_data = MediaPageStore.get('media-data');

    let imgUrl = 'string' === typeof media_data.poster_url ? media_data.poster_url.trim() : '';

    if ('' === imgUrl) {
      imgUrl = 'string' === typeof media_data.thumbnail_url ? media_data.thumbnail_url.trim() : '';
    }

    if ('' === imgUrl) {
      imgUrl =
        'string' === typeof MediaPageStore.get('media-original-url')
          ? MediaPageStore.get('media-original-url').trim()
          : '';
    }

    if ('' === imgUrl) {
      return '#';
    }

    return site.url + '/' + imgUrl.replace(/^\//g, '');
  }

  useEffect(() => {
    MediaPageStore.on('loaded_image_data', onImageLoad);
    return () => MediaPageStore.removeListener('loaded_image_data', onImageLoad);
  }, []);

  return !image ? null : (
    <div className="viewer-image-container-topimage-bottomtext"
    style={{backgroundImage: `url(${mediaState.background_image})`
    ,
    aspectRatio: 1,
    backgroundSize: 'cover', backgroundPosition: 'center'}}
    
    >
      <div className="middleArea"
      style={{
        flexDirection: mediaState.flex_direction,
        padding: `${mediaState.padding_content}px`,
        textAlign: mediaState.font_align,
      }}
      >
      <img src={image} alt={MediaPageStore.get('media-data').title || null} 
      style={{
        scale: `${mediaState.scale*0.01}`,
      }}
      />
      <p className="special_state_text" style={{
        fontSize: `${fontSize}px`,
        fontWeight: mediaState.font_bold ? 'bold' : 'normal',
        color: mediaState.font_color,
      }}>{mediaState.body_text}</p>
    </div>
    </div>
  );
}
