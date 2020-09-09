import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native'

const ProgressiveImage = ({ style, key, source, thumbnail }) => {

  const [thumbnailOpacity, setThumbnailOpacity] = useState(new Animated.Value(0));
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  function onLoad() {
    setIsImageLoaded(true);
    Animated.timing(thumbnailOpacity, {
      toValue: 0,
      duration: 250
    }).start()
  }
  function onThumbnailLoad() {
    if (!isImageLoaded)
      Animated.timing(thumbnailOpacity, {
        toValue: 1,
        duration: 250
      }).start()
  }
  return (
    <View
      width={style.width}
      height={style.height}
      backgroundColor={'#ffffff'}
      style={style}
    >
      <Animated.Image
        resizeMode={'cover'}
        key={key}
        style={[
          {
            position: 'absolute'
          },
          style
        ]}
        source={source}
        onLoad={event => onLoad(event)}
      />
      <Animated.Image
        resizeMode={'cover'}
        key={key}
        style={[
          {
            opacity: thumbnailOpacity
          },
          style
        ]}
        source={thumbnail}
        onLoad={event => onThumbnailLoad(event)}
      />
    </View>
  )
}

export default ProgressiveImage;

ProgressiveImage.propTypes = {
  source: PropTypes.object,
  thumbnail: PropTypes.object,
  style: PropTypes.object,
  key: PropTypes.string
}
