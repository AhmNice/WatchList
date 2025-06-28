import jwt from 'jsonwebtoken'

export const verifySession = async ( req, res, next) =>{
  const token = req.cookies['watchList_session']
  if(!token){
    return res.status(401).json({
      success:false,
      message:'No session token provided'
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY)
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.log('Error trying to verify session', error.message)
     return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token'
    });
  }
}