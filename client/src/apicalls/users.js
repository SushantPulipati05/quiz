const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/register', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/login', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post('/api/users/get-user-info');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
export const updateUserRole = async (payload) => {
    try {
        const response = await axiosInstance.put('/api/users/update-user-role', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

//get  all users
export const getAllUsers = async () => {
    try {
      const response = await axiosInstance.post("/api/exams/get-all-users");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };



export const promoteToAdmin = async (payload) => {
    try {
        const response = await axiosInstance.put('/api/users/promote-to-admin', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
export const assignExamAccess = async (payload) => {
    try {
      const response = await axiosInstance.put('/api/users/assign-exam-access', payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  export const promoteUserToAdmin = async (payload) => {
    try {
      const response = await axiosInstance.put('/api/users/promote-to-admin', payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

  

  