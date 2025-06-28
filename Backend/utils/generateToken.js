import crypto from 'crypto'

export const generateDeactivationToken = () => {
  return crypto.randomBytes(15).toString('hex');
}
export const generateResetPasswordToken =  () =>{
  return crypto.randomBytes(15).toString('hex')
}
export const generateAccountDeleteToken = ()=>{
  return crypto.randomBytes(15).toString('hex')
}