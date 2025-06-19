import Cookies from 'js-cookie'; 

function ApiService() {
  const baseURL = "https://localhost:7226";

  const appendRoute = (route: string) => {
    return baseURL + "/" + route;
  };

  const headerConfig = () => {
    const auth = Cookies.get("token");

    if (auth) {
      return {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth}`
        }
      };
    } else {
      return {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
  };

  return {
    appendRoute,
    headerConfig 
  };
}

export default ApiService;
