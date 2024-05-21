import { instance } from "../axios";

const findAll = async (data) => {
    try {
        const response = await instance.get("/products", data);
        return response.data;
    } catch (error) {
        console.error("Error fetching product data:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const findOne = async (slug) => {
    try {
        const response = await instance.get(`/products/`, slug /*slug and role?*/);
        return response.data;
    } catch (error) {
        console.error("Error fetching product data:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const create = async (data) => {
    try {
        const response = await instance.post("/products", data);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const update = async (id, data) => {
    try {
        const response = await instance.put(`/products/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error.response ? error.response.data : error.message);
        throw error;
    }
};  

const uploadImage = async (id, data) => {
    try {
        const response = await instance.put(`/products/${id}`, data /** productId and filePath? */);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const destroy = async (id) => {
    try {
        const response = await instance.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export { findAll, findOne, create, update, destroy};