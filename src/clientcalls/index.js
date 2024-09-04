exports.authenticate = async function (phoneNumber, password) {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = await fetch(`/authenticate`, {
      method: "POST",
      headers,
      body: JSON.stringify({ phoneNumber: phoneNumber, password: password }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return {
        message: "Authenticated",
        username: responseData.user_name,
        authenticated: true,
      };
    } else {
      const responseData = await response.json();
      throw { message: responseData.message, authenticated: false };
    }
  } catch (error) {
    throw {
      message:
        error.message || error.error || error.title || "server side error",
      authenticated: false,
    };
  }
};
