import jwt from  'jsonwebtoken'
export const setSession =async (res, userId) =>{
  if(!process.env.JWT_SECRETE_KEY){
    throw new Error('JWT key not provided')
  }
  const token = jwt.sign(
    {userId},
    process.env.JWT_SECRETE_KEY,
    {expiresIn: '2d'}
  );
  const cookieName = 'watchList_session';
  res.cookie(cookieName, token,{
    httpOnly:true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 2 * 24 * 60*60 * 1000
  });

  return token
}