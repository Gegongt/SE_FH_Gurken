const axios = require("axios");

exports.register = async (email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`;
  const payload = { email, password, returnSecureToken: true };

  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.login = async (email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
  const payload = { email, password, returnSecureToken: true };

  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (e) {
    throw e;
  }
};

exports.sendVerifyEmail = async (idToken) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_API_KEY}`;
  const payload = { requestType: "VERIFY_EMAIL", idToken };
  const { data } = await axios.post(url, payload);
  return data;
};