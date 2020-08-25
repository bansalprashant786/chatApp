import React from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const CircularProgressBar = props => {
  const { percentage, size, width } = props;
  return (
    <AnimatedCircularProgress
      size={size}
      width={width}
      fill={percentage}
      duration={0}
      tintColor={'#2196f3'}
      backgroundColor={'#efefef'}
    />
  );
};
export default CircularProgressBar;
