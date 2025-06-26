/*eslint import/no-anonymous-default-export: "off"*/
import axios from "axios";

export default {
  setupInterceptors: () => {
    axios.defaults.baseURL = "https://qcotp.qoetech.com"; //for dev https://qcotp.qoetech.com/  for Production --https://qc8.qoeqoe.com
    axios.interceptors.request.use(
      (request) => {
        ///   console.info('API Request:------', `${request.method} : ${request.url}`,request.url?.split('=')[1]);
        if (localStorage.getItem("user_id")) {
          // request.headers['Authorization'] = `${JSON.parse(localStorage.getItem('user_id'))}`//`Bearer ${JSON.parse(localStorage.getItem('user_id'))}`
          request.headers["Authorization"] =
            request.url?.split("=")[1] == "mitigation_probe_config_data&version"
              ? `${JSON.parse(localStorage.getItem("user_id"))}`
              : `Bearer ${JSON.parse(localStorage.getItem("user_id"))}`;
        }
        if (request.data) {
          // console.info('API Request data:', request.data);
        }
        if (request.params) {
          //  console.info('API Request params:', request.params);
        }
        return request;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          window.location = "/";
        } else if (error.response && error.response.status === 500) {
          console.log(error);
          return error.response;
        } else {
          console.log(error);
          return Promise.reject(error);
        }
      }
    );
  },
};
