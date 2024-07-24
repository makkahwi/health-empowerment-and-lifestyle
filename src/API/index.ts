import axios from "axios";

import { signOut } from "../Store/authSlice";
import store from "../Store/store";

const service = axios.create({
  baseURL:
    "https://personal-diet-tracker-default-rtdb.europe-west1.firebasedatabase.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

service.interceptors.request.use(
  (config) => {
    const user = store.getState().auth?.user;

    if (user.idToken) {
      config.headers.Authorization = `Bearer ${user.idToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (res) => {
    if (res?.status == 200 || res?.status == 201 || res?.status == 204) {
      return res.data;
    }

    if (res?.status == 401 || res?.status == 403) {
      store.dispatch(signOut());
    }
  },
  (err) => {
    if (err?.response?.status == 401 || err?.response?.status == 403) {
      store.dispatch(signOut());
    }
  }
);

const getAll = async (table = "") => {
  const user = store.getState().auth.user;

  return await service
    .get(table + "/" + user.localId + ".json")
    .then((res: any) =>
      res.documents?.map(({ name, fields }: any) =>
        Object.keys(fields).reduce(
          (final, key) => ({ ...final, [key]: fields[key]?.stringValue }),
          { id: name.split("/")[name.split("/").length - 1] }
        )
      )
    );
};

const create = async (table = "", data = {}) => {
  const user = store.getState().auth.user;

  return await service.post(table + "/" + user.localId + ".json", {
    ...data,
    uid: user.localId,
  });
};

const update = async (table = "", data = { id: "" }) => {
  const user = store.getState().auth.user;

  return await service.patch(
    table + "/" + user.localId + "/" + data.id + ".json",
    {
      ...data,
      uid: user.localId,
    }
  );
};

const remove = async (table = "", id = "") => {
  const user = store.getState().auth.user;

  return await service.delete(table + "/" + user.localId + "/" + id + ".json");
};

export { create, getAll, remove, update };
