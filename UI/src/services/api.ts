/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { param } from 'jquery';

// Create an axios instance for the login API
export const axiosLogin = axios.create({

  baseURL: "https://primeqas.nipponpaint.co.in/log/api/Auth", // Base URL for your authentication API
});

export const axiosEngineeringLog = axios.create({
  baseURL: "https://primeqas.nipponpaint.co.in/log/api",

})

export const setAuthIncerceptor = (token: string) => {
  axiosEngineeringLog.defaults.headers.Authorization = `Bearer ${token}`;
};


export const loginUserApi = async (data: any) => {


  const response = await axiosLogin.post('/login', data);
  return response.data;

};


export const GetDashboardAPI = async () => {
  const res = (await axiosEngineeringLog.get("/Dashboard/location?frequency=1")).data
  return res
};

export const GetDashboardMonthlyAPI = async () => {
  const res = (await axiosEngineeringLog.get("/Dashboard/location?frequency=2")).data
  return res
};

export const GetFieldsBasedOnLocationIdAPI = async (params: any) => {
  const res = (await axiosEngineeringLog.get("/Form/GetFieldsByLocationId", {
    params,
    paramsSerializer: { indexes: true }
  })).data
  return res
}

export const UpdateFieldvalueAPI = async (data: any) => {
  return await axiosEngineeringLog.put("/Form/UpdateFieldvalue", data);
};

export const CreateTransaByLocationIdAPI = async (data: any) => {
  return await axiosEngineeringLog.post("/Form/CreateTransaByLocationId", data);
};
export const UpdateTransactionStatusAPI = async (data: any) => {
  return await axiosEngineeringLog.put("/Form/UpdateTransactionStatus", data);
};



export const GetApproverDashboardAPI = async () => {
  const res = (await axiosEngineeringLog.get("Dashboard/ApproverDashboard")).data
  return res
};

export const GetViewPageDashboardAPI = async () => {
  const res = (await axiosEngineeringLog.get("/Dashboard/ViewPageDashboard")).data
  return res
};




export const GetViewPageDetailedAPI = async (params: any) => {
  const res = (await axiosEngineeringLog.get("/Form/GetViewPageDetailed", {
    params,
    paramsSerializer: { indexes: true }
  })).data
  return res
}

export const GetViewPageGridAPI = async (params: any) => {
  const res = (await axiosEngineeringLog.get("/Form/GetViewPageGrid", {
    params,
    paramsSerializer: { indexes: true }
  })).data
  return res
}

export const getMap_API = async (params: any) => {
  const res = (await axiosEngineeringLog.get("/Dashboard/Map", {
    params,
    paramsSerializer: { indexes: true }
  })).data
  return res
}








// export const InsertDataApi = async (data:any,locationID:number)=> {
//   const Res=(await axiosEngineeringLog.post("Dashboard/fields?locationId="+locationID,data))
//   return Res
// };

// export const GetFieldsBasedOnLocationIdAPI=async(params:any)=>{
//   const res=(await axiosEngineeringLog.get("EngineeringLog/form",{
//     params,
//     paramsSerializer:{indexes:true}
//   })).data
//   return res
// }


// export const InsertDataApi = async (data:any,locationID:number)=> {
//   const Res=(await axiosEngineeringLog.post("EngineeringLog/form?locationId="+locationID,data))
//   return Res
// };
