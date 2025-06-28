export const verifyUser = async ( req, res, next) => {
  const { userId } = req.body;
  if(!userId) {
    return res.status(400).json({
      success:false,
      message:'userId is required'
    });
  }
  try {
    if(!process.env.JWT_SECRETE_KEY) {
      return res.status(500).json({
        success:false,
        message:'JWT secret key not provided'
      });
    }
    const token = req.cookies('watchList_session');
    if(!token){
      return res.status(401).json({
        success:false,
        message:'Unauthorized access, please login'
      });
    };
    const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    if(decoded.userId !== userId){
      return res.status(403).json({
        success:false,
        message:'Forbidden access, userId does not match'
      });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Error verifying user:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}