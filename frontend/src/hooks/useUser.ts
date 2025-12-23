import React from 'react';

export const useUser = (userId: string) => {
  const [isLogin, setIsLogin] = React.useState(false);
  return { isLogin, setIsLogin };
};
