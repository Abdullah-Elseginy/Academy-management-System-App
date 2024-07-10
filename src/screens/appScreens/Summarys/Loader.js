import React from 'react';
import ContentLoader, {Rect, Circle, Path} from 'react-content-loader/native';

const MyLoader = props => (
  <ContentLoader
    speed={2}
    width={476}
    height={124}
    viewBox="0 0 476 124"
    backgroundColor="#d1d1d1"
    foregroundColor="#e6e6e6"
    {...props}>
    <Rect x="10" y="3" rx="0" ry="0" width="456" height="120" />
  </ContentLoader>
);

export default MyLoader;
