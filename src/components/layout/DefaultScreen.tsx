import React from 'react';
import { View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const DefaultScreen = ({ children }: Props) => {
  return <View style={{ flex: 1, backgroundColor: '#fff' }}>{children}</View>;
};

export default DefaultScreen;
