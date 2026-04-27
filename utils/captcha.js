const axios = require('axios');


const verifyCaptcha = async (token) => {

if (!token) return { success: false, message: "Captcha token is missing!" };

try{
const RECAPTCHA_SECRET_KEY = "6Lc_gLUsAAAAADD0YN6gCnyPV0FkXTyt3ScLY2EA"
const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
);
if (response.data.success){
 return { success: true };   
}else{
 return { success: false, message: "Captcha verification failed!" };   
}
}
catch(error){
return { success: false, message: "Captcha server error!" };
}
}


module.exports = verifyCaptcha;